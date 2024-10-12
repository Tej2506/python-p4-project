# app.py
#!/usr/bin/env python3

# Remote library imports
from flask import request

# Local imports
from config import app, db, api, bcrypt  # bcrypt imported from config
from models import User, Car, Feature, Comparison  # Import your models

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
