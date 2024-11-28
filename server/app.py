# app.py
#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, jsonify, make_response, session
from flask_restful import Resource
from bs4 import BeautifulSoup
import requests
import os

# Local imports
from config import app, db, api, bcrypt, CORS  # bcrypt imported from config
from models import User, Car, Feature, Comparison  # Import your models
# from auth import SignupResource, LoginResource, LogoutResource, CheckLoginResource

app.secret_key = b'\x11\x16\x83\xfee\x97\x0e\xd5Y5:FR+\xb1\\'
# web scraping function to get car details
def scrape_car_details(manufacturer, car_name):
    manufacturer_search_query = manufacturer.replace(" ", "-").lower()
    car_name_search_query = car_name.replace(" ", "-").lower()

    url = f"https://www.cardekho.com/{manufacturer_search_query}-cars/{car_name_search_query}"
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



class Index(Resource):

    def get(self):

        response_dict = {
            "index": "Welcome to the Car Compare API",
        }
        response = make_response(
            response_dict,
            200,
        )

        return response
    
        
        # users = [user.to_dict() for user in User.query.all()]
        # return make_response(users)
        # users = User.query.all()
        # cars = Car.query.all()
        # for car in cars:
        #     db.session.delete(car)
        #     db.session.commit()
        # for user in users:
        #     db.session.delete(user)
        #     db.session.commit()
        # print('cars deleted')

        # users = [user.to_dict() for user in User.query.all()]
        # return make_response(users, 200)
        # cars = [car.to_dict() for car in Car.query.all()]
        # return make_response(cars, 200)



api.add_resource(Index, '/')

class CarsResource(Resource):

    def get(self):
        cars = [car.to_dict() for car in Car.query.all()]
        return make_response(jsonify(cars), 200)

    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if user_id:
            car = Car.query.filter_by(name = data['car_name']).first()
            if car:
                cars_added = [comparison.car_id for comparison in Comparison.query.filter_by(user_id=user_id).all()]
                if (car.id not in cars_added) :
                    comparison = Comparison(user_id=user_id, car_id=car.id)
                    db.session.add(comparison)
                    db.session.commit()
                return make_response(car.to_dict(),201)
            
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

                # Associate features with car
                features = car_details.get('features_list', [])
                for feature_name in features:
                    feature = Feature.query.filter_by(name=feature_name.lower()).first()
                    if not feature:
                        feature = Feature(name=feature_name.lower())
                        db.session.add(feature)
                        db.session.commit()

                    # Append the feature to the car
                    if feature not in car.features:
                        car.features.append(feature)

                db.session.commit()
                print(user_id,"this is user_id")
                cars_added = [comparison.car_id for comparison in Comparison.query.filter_by(user_id=user_id).all()]
                if (car.id not in cars_added) :
                    comparison = Comparison(user_id=user_id, car_id=car.id)
                    db.session.add(comparison)
                    db.session.commit()
                    response = make_response(car.to_dict(), 200)
                    return response
                else:
                    return make_response({'message':'car already added under user'},203)
    
            else:
                return make_response({"message": "Car details not found"}, 404)
        else: 
            return make_respone({"error":"User not logged in"},404)

api.add_resource(CarsResource, '/cars')

class DeleteComparisonResource(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if user_id:
            car_ids_to_delete = data['car_ids']
            if not car_ids_to_delete:
                return make_response({"message": "No cars provided for deletion"}, 400)

            user_cars = Comparison.query.filter_by(user_id = user_id).all()
            if user_cars:
                for user_car in user_cars:
                    if(user_car.car_id in car_ids_to_delete):
                        db.session.delete(user_car)
                db.session.commit()
                return make_response({"message": "cars deleted successfully"}, 200)
            else:
                return make_response({"message":"Could not delete cars"}, 404)
        else:
            return make_respone({"message":"User not logged in"},404)
        

api.add_resource(DeleteComparisonResource, '/delete_comparisons')

class MyComparisonsResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        print("Session id:", user_id)
        if not user_id:
            return make_response({"error": "User not logged in"}, 401)

        # Query comparisons for the user
        comparisons = Comparison.query.filter_by(user_id=user_id).all()

        # Retrieve car details from the comparisons
        if comparisons:
            comparison_data = []
            for comparison in comparisons:
                car = Car.query.filter_by(id=comparison.car_id).first()
                if car:
                    response = comparison_data.append(car.to_dict())

            return make_response(jsonify(comparison_data), 200)
        else:
            return make_response({'message': 'No cars added'}, 204)

api.add_resource(MyComparisonsResource, '/my_comparisons')

class Dashboard(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "User not logged in"}, 401)
        
        user = User.query.filter_by(id = user_id).first()
        return make_response({'username': user.username}, 200)
    
    def patch(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "User not logged in"}, 401)

        data = request.get_json()
        user = User.query.filter_by(id = user_id).first()
        if user:
            if 'username' in data:
                setattr(user, 'username', data.get('username'))
                db.session.commit()
                return make_response({'message':'credential changed'},200)
            if 'new_password' and 'current_password' in data:
                    if not user.authenticate(data.get('current_password')):
                        return make_response({"message": "Incorrect current password"},401)
                    else:
                        user.password = data.get('new_password')
                        db.session.commit()
                        return make_response({'message':'credential changed'},200)
            else:
                return make_response({'message':"fill both password fields"},401)
        else:
            return make_response({"error": "Unauthorized action"}, 403)
    
    def delete(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "User not logged in"}, 401)
        
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response({'message': 'User account deleted'}, 200)
        
        

class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(username = data.get('username')).first()

        if existing_user:
            return make_response({'error': 'Username already exists'}, 400)
        
        else:
            new_user = User()
            new_user.username = data.get('username')
            new_user.password= data.get('password')
           
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 200)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username = data['username']).first()

        if user:
            if user.authenticate(data['password']):
                session['user_id'] = user.id
                print(f"Session data during /my_comparisons request: {session}")
                return make_response({'user_id': user.id}, 200)
            else:
                print(session)
                return make_response({'message':'Incorrect password, try again'},201)
        else:
            return make_response({'message':'User does not exist'},202)


class LogoutResource(Resource):
    def post(self):
        session.pop('user_id', None)
        return make_response({'message': 'Logged out successfully'},200)


# Views go here!
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(Dashboard,'/user/dashboard')


if __name__ == '__main__':
    app.run(port=5000, debug=True)

