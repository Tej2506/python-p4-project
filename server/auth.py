# auth.py
from flask import request, make_response, session
from flask_restful import Resource
from config import db, bcrypt
from models import User

def is_logged_in():
    return 'user_id' in session

class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(username = data.get('username')).first()

        if existing_user:
            return make_resposne({'error': 'Username already exists'})
        
        else:
            new_user = User(data.get('username'))
            new_user.set_password(data.get('password'))
            db.session.add(new_user)
            db.session.commit()

            session['user_id']= new_user.id
            return make_resposne(new_user.to_dict(), 200)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username = data.get('username')).first()

        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return make_response({'user_id': user.id}, 200)

class LogoutResource(Resource):
    def post(self):
        session.pop('user_id', None)
        return make_response({'message': 'Logged out successfully'},200)

class CheckLoginResource(Resource):
    def get(self):
        if is_logged_in():
            return make_response({'message': 'User is logged in'},200)

        else:
            return make_response({'message': 'User is not logged in'}, 401)


