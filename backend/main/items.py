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

@items.get("/items/search")
def search_items():
    category = request.args.get("category", "").strip()

    if not category:
        return jsonify({"error": "Category is required"}), 400

    connection = None
    cursor = None

    try:
        connection = connect_db()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT item_id, username, title, category, description, price
            FROM items
            WHERE category LIKE %s
            """,
            ("%" + category + "%",)
        )

        results = cursor.fetchall()
        return jsonify(results), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 400

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
@items.get("/items/my-items")
def get_my_items():
    username = request.args.get("username", "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    connection = None
    cursor = None

    try:
        connection = connect_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT item_id, title, category, description, price, created_at
            FROM items
            WHERE username = %s
            ORDER BY created_at DESC
            """,
            (username,)
        )
        results = cursor.fetchall()
        for row in results:
            if row.get("created_at"):
                row["created_at"] = str(row["created_at"])
        return jsonify(results), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 400

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@items.get("/items/<int:item_id>/reviews")
def get_item_reviews(item_id):
    connection = None
    cursor = None

    try:
        connection = connect_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT username, rating, description, created_at
            FROM reviews
            WHERE item_id = %s
            ORDER BY created_at DESC
            """,
            (item_id,)
        )
        results = cursor.fetchall()
        for row in results:
            if row.get("created_at"):
                row["created_at"] = str(row["created_at"])
        return jsonify(results), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 400

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@items.post("/items/review") # use a post request to make a review instead of get
def make_review(): #function for a reivew
    data = request.get_json() or {}
    username = data.get("username") # username
    item_id = data.get("item_id") # item id
    review = data.get("review") # review
    rating = data.get("rating") # rating
    description = data.get("description") # description
    
    connection = None
    cursor = None
    
    try:
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT username FROM items WHERE item_id = %s",
            (item_id,)
        )
        item = cursor.fetchone()
        if item and item[0] == username:
            return jsonify({"error": "You cannot review your own item"}), 400
        
        cursor.execute(
            "SELECT id FROM reviews WHERE username = %s AND item_id = %s",
            (username, item_id)
        )
        
        #checks if the user has already reviewed the item
        if cursor.fetchone():
            return jsonify({"error": "You have already reviewed this item"}), 400
        
        # check for 2 reviews per day limit
        cursor.execute(
            "SELECT COUNT(*) FROM reviews WHERE username = %s AND DATE(created_at) = CURDATE()",
            (username,)
        )
        
        if cursor.fetchone()[0] >= 2:
            return jsonify({"error": "You can only post 2 reviews a day"}), 400
        
        cursor.execute(
            """
            INSERT INTO reviews (username, item_id, rating, description)
            VALUES (%s, %s, %s, %s)
            """,
            (username, item_id, rating, description)
        )
        
        connection.commit()
        return jsonify({"message": "Review created successfully"}), 201
    
    except mysql.connector.Error as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
    
    
        