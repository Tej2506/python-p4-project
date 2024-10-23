#models.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt

# User model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    
    comparisons = db.relationship('Comparison', back_populates='user', cascade='all, delete-orphan')
    compared_cars = association_proxy('comparisons', 'car') 

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        self._password_hash = password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

# Car model
class Car(db.Model, SerializerMixin):
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    manufacturer = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.String)
    power = db.Column(db.String)
    engine = db.Column(db.String)
    torque = db.Column(db.String)

    features = db.relationship('Feature', secondary='car_features', back_populates='cars')
    comparisons = db.relationship('Comparison', back_populates='car', cascade='all, delete-orphan')
    serialize_only = ('id', 'manufacturer', 'name', 'price', 'power', 'engine', 'torque', 'feature_names')
    feature_names = association_proxy('features', 'name')  

# Feature model (many-to-many relationship)
class Feature(db.Model, SerializerMixin):
    __tablename__ = 'features'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    cars = db.relationship('Car', secondary='car_features', back_populates='features')

# Association table between Car and Feature
car_features = db.Table('car_features',
    db.Column('car_id', db.Integer, db.ForeignKey('cars.id')),
    db.Column('feature_id', db.Integer, db.ForeignKey('features.id'))
)

# Comparison model (to save comparison data)
class Comparison(db.Model, SerializerMixin):
    __tablename__ = 'comparisons'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'))

    user = db.relationship('User', back_populates='comparisons')
    car = db.relationship('Car', back_populates='comparisons')
