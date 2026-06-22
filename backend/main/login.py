from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash

from main.db import connect_db

auth = Blueprint("auth", __name__)

# Function for user registration
@auth.post("/register")
def register():
    data = request.get_json() or {}
    username = data.get("username") # username
    password = data.get("password") # password
    first_name = data.get("first_name") # first name
    last_name = data.get("last_name") # last name
    phone_number = data.get("phone_number") # phone number
    email = data.get("email") # email
    
# Hash the password before storing it in the database
# Hash the password using werkzeug.securitys generate_password_hash function
# Tasked with in the assignment
    hashed = generate_password_hash(password)

# check if username and password are provided
    if not username or not password:
        return jsonify({"error": " Sorry,Username and password are required"}), 400

    connection = None
    cursor = None

    # try to connect to the database and insert the new user
    try:
        connection = connect_db() # connect to the database using the connect_db function from db.py
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO users (username, password, first_name, last_name, email, phone_number)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (username, hashed, first_name, last_name, email, phone_number),
        )
        connection.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as error: # catch any exceptions and return an error message
        return jsonify({"error": str(error)}), 400
    finally: # close the cursor and connection to the database
        if cursor:
            cursor.close() 
        if connection:
            connection.close()

# Function for user login
@auth.post("/login")
def login():
    data = request.get_json() or {}
    username = data.get("username") # username
    password = data.get("password") # password

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    connection = None
    cursor = None

    try:
        connection = connect_db() # same as above, connecting using function from db.py
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT username, password, first_name, last_name, email, phone_number
            FROM users 
            WHERE username = %s
            """,
            (username,), 
        )
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], password): # check if user exists and if the password is correct using werkzeug.securitys check_password_hash function
            return jsonify({"error": "Invalid username or password"}), 401

        user.pop("password", None)

        return jsonify({"message": "Login successful", "user": user}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
