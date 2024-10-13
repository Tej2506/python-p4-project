# app.py
#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, jsonify, make_response
from flask_restful import Resource
from bs4 import BeautifulSoup
import requests

# Local imports
from config import app, db, api, bcrypt  # bcrypt imported from config
from models import User, Car, Feature, Comparison  # Import your models

# web scraping function to get car details
def scrape_car_details(manufacturer, car_name):
    manufacturer_search_query = manufacturer.replace(" ", "-").lower()
    car_name_search_query = car_name.replace(" ", "-").lower()

    url = f"https://www.cardekho.com/{manufacturer_search_query}/{car_name_search_query}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    
    response = requests.get(url, headers = headers)
    print(response.status_code)
    
    if response.status_code != 200:
        print(f"Failed to retrieve data for {car_name}")
        return None

    soup = BeautifulSoup(response.text,'html.parser')
    car_details = {}
    car_details['name'] = car_name
    car_details['manufacturer'] = manufacturer
    car_details['price'] = soup.find('div', class_= 'price').text.split('Rs.')[1].split('*')[0]
    tr_elements = soup.find('div', class_="qccontent").find_all('tr')
    li_elements = soup.find_all('div', class_="qccontent")[1].find('ul').find_all('li')
    car_specs=["Engine", "Power", "Torque"]
    
    for row in tr_elements:
        car_spec = row.find_all('td')[0].text.strip()
        car_spec_value = row.find_all('td')[1].text.strip()
        if car_spec in car_specs:
            car_details[car_spec] = car_spec_value
    
    features_list = []
    for row in li_elements:
        features_list.append(row.text.strip())
    car_details["features_list"]=features_list
        
    return car_details


# Views go here!

@app.route('/')
def index():
    return '<h1>Car Comppare API</h1>'

class CarsResource(Resource):

    def get(self):
        cars = [car.to_dict() for car in Car.query.all()]
        return make_response(jsonify(cars), 200) 

    def post(self):
        data = request.get_json()
        car_details = scrape_car_details(data.get('manufacturer'), data.get('car_name'))

        if car_details:
            car = Car(
                manufacturer=car_details['manufacturer'],
                name=car_details['name'],
                price=car_details['price'],
                power=car_details.get('Power'),
                engine=car_details.get('Engine'),
                torque=car_details.get('Torque')
            )
            db.session.add(car)
            db.session.commit()

            response = make_response(car.to_dict(), 201)
            return response
        else:
            return make_response({"error": "Car details not found"}, 404)

api.add_resource(CarsResource, '/cars')

class CarByID(Resource):

    def get(self, id):
        car = Car.query.filter_by(id=id).first()
        if car:
            return make_response(jsonify(car.to_dict()), 200)
        else:
            return make_response({"error": "Car not found"}, 404)

    def delete(self, id):
        car = Car.query.filter_by(id=id).first()
        if car:
            db.session.delete(car)
            db.session.commit()
            return make_response({"message": "Car successfully deleted"}, 200)
        else:
            return make_response({"error": "Car not found"}, 404)

    def patch(self, id):
        car = Car.query.filter_by(id=id).first()
        if car:
            for attr in request.json:
                setattr(car, attr, request.json[attr])
            db.session.commit()
            return make_response(car.to_dict(), 200)
        else:
            return make_response({"error": "Car not found"}, 404)

api.add_resource(CarByID, '/cars/,int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
