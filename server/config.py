# config.py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt  # Import Bcrypt
from sqlalchemy import MetaData
from datetime import timedelta
import os

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://car_compare_db_user:k17MVPFlbtvFmWxJX9u8bye8OMDd8ZSm@dpg-cscvd1lds78s73bfcql0-a.ohio-postgres.render.com/car_compare_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = os.urandom(16)
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS and Bcrypt
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
bcrypt = Bcrypt(app) 
