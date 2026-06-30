# For phase 2 of project
# Items, description, etc.

from flask import Blueprint, jsonify, request
import mysql.connector # talks to databse
from main.db import connect_db

items = Blueprint("items", __name__)

@items.post("/items")
def create_item():
    data = request.get_json() or {}
    username = data.get("username") # username
    title = data.get("title") # item title
    category = data.get("category") # item category
    description = data.get("description") # item description
    price = data.get("price") # item price

    if not username or not title or not category or not description or not price:
        return jsonify({"error": "Username, title, category, description, and price are required"}), 400

    connection = None
    cursor = None

    try:
        connection = connect_db() # connect to the database using the connect_db function from db.py
        cursor = connection.cursor()
        cursor.execute(
             """
            SELECT COUNT(*) FROM items
            WHERE username = %s AND DATE(created_at) = CURDATE()
            """,
            (username,)
        )
        count = cursor.fetchone()[0]
        
        if count >= 2:
            return jsonify({"error": "You can only post 2 items a day"}), 400
        
        cursor.execute(
            """
            INSERT INTO items (username, title, category, description, price)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (username, title, category, description, price),
        )
           
        connection.commit()
        return jsonify({"message": "Item created successfully"}), 201
    
    except Exception as error: # catch any exceptions and return an error message
        return jsonify({"error": str(error)}), 400
    finally: # close the cursor and connection to the database
        if cursor:
            cursor.close() 
        if connection:
            connection.close()

