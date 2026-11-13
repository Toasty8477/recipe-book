# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import mysql.connector
import os

def connect_to_db(connection=None):

    if connection is None or not connection.is_connected():
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database="recipe_book"
        )
    return connection

def add_ingredient(connection, ingredient_name, ingredient_type):
    query = "INSERT INTO ingredients (name, type) VALUES (%s, %s)"
    cursor = connection.cursor()

    try:
        cursor.execute(query, (ingredient_name, ingredient_type))
        connection.commit()
    except mysql.connector.Error as e:
        print(f"Error adding ingredient: {e}")
        connection.rollback()
        raise
    finally:
        cursor.close()


def get_ingredient(connection, ingredient_name):
    query = "SELECT name FROM ingredients WHERE name = %s"
    cursor = connection.cursor()
    cursor.execute(query, (ingredient_name,))
    if cursor.rowcount == 0:
        return None
    return cursor.fetchone()

def add_recipe(connection, recipe_name, recipe_type, ingredients, instructions):
    pass

def get_all_recipes(connection):
    query = "SELECT recipe_id, recipe_name, recipe_type FROM recipe"
    cursor = connection.cursor()
    cursor.execute(query)
    return cursor.fetchall()

def get_recipe_by_id(connection, recipe_id):
    pass

def get_recipes_by_name(connection, name):
    pass

def get_related_recipes(connection, recipe_id):
    pass

def make_meal(connection, meal_name, main_dish_id, side_dish_id=None, dessert_id=None):
    pass