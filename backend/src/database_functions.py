# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import mysql.connector
import os
from pydantic_defs import IngredientModel

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
    search = "SELECT ingredient_name FROM ingredient WHERE ingredient_name = %s;"
    query = "INSERT INTO ingredient (ingredient_name, ingredient_type) VALUES (%s, %s);"
    cursor = connection.cursor()
    ingredient = None

    try:
        cursor.execute(search, (ingredient_name,))
        ingredient = cursor.fetchall()
        # If ingredient does not exist yet create it
        if len(ingredient) == 0:
            cursor.execute(query, (ingredient_name, ingredient_type))
            connection.commit()
            cursor.execute(search, (ingredient_name,))
            ingredient = cursor.fetchall()

    except mysql.connector.Error as e:
        print(f"Error adding ingredient: {e}")
        connection.rollback()
        raise
    finally:
        cursor.close()

    return ingredient


def get_ingredient(connection, ingredient_name):
    query = "SELECT name FROM ingredients WHERE name = %s"
    cursor = connection.cursor()
    cursor.execute(query, (ingredient_name,))
    if cursor.rowcount == 0:
        return None
    ret = cursor.fetchone()
    connection.commit()
    return ret

def add_recipe(connection, recipe_name, recipe_type, instructions, ingredients: list[IngredientModel]):
    add_recipe_query = "INSERT INTO recipe (recipe_name, recipe_type, instructions) VALUES (%s, %s, %s)"
    get_id_query = "SELECT recipe_id FROM recipe WHERE recipe_name = %s"
    link_ingredient_query = "INSERT INTO used_in VALUES (%s, %s, %s, %s)"
    cursor = connection.cursor()

    try:
        cursor.execute(add_recipe_query, (recipe_name, recipe_type, instructions))
        cursor.execute(get_id_query, (recipe_name,))
        recipe_id = cursor.fetchall()[0][0]
        
        for ingredient in ingredients:
            cursor.execute(link_ingredient_query, (recipe_id, ingredient.name, ingredient.quantity, ingredient.unit))

        connection.commit()

    except mysql.connector.Error as e:
        connection.rollback()

    finally:
        cursor.close()

    return recipe_id
    

def get_all_recipes(connection):
    query = "SELECT recipe_id, recipe_name, recipe_type FROM recipe"
    cursor = connection.cursor()
    cursor.execute(query)
    ret = cursor.fetchall()
    cursor.close()
    connection.commit()
    return ret

def get_recipe_by_id(connection, recipe_id):
    query = ("SELECT r.recipe_id, r.recipe_name, r.recipe_type, r.instructions, u.quantity, u.unit, "
                "i.ingredient_name, i.ingredient_type FROM recipe AS r "
                "LEFT JOIN used_in AS u ON r.recipe_id = u.recipe_id "
                "JOIN ingredient AS i ON u.ingredient_name = i.ingredient_name "
                "WHERE r.recipe_id = %s;")
    cursor = connection.cursor()
    cursor.execute(query, (recipe_id,))
    ret = cursor.fetchall()
    cursor.close()
    connection.commit()
    return ret

def get_recipes_by_name(connection, name):
    query = "SELECT recipe_id, recipe_name, recipe_type FROM recipe WHERE recipe_name = %s"
    cursor = connection.cursor()
    cursor.execute(query, (name,))
    ret = cursor.fetchall()
    cursor.close()
    connection.commit()
    return ret

def get_related_recipes(connection, recipe_id):
    query = ("SELECT main.recipe_id, main.recipe_name, side.recipe_id, "
                "side.recipe_name, side.recipe_type FROM recipe AS main "
                "JOIN goes_with AS g ON main.recipe_id = g.dish_1_id "
                "JOIN recipe AS side ON side.recipe_id = g.dish_2_id "
                "WHERE main.recipe_id = %s;")
    cursor = connection.cursor()
    cursor.execute(query, (recipe_id,))
    ret = cursor.fetchall()
    cursor.close()
    connection.commit()
    return ret

def remove_recipe(connection, recipe_id: int):
    query1 = "DELETE FROM recipe WHERE recipe_id = %s"
    query2 = "DELETE FROM used_in WHERE recipe_id = %s"
    cursor = connection.cursor()

    try:
        cursor.execute(query2, (recipe_id,))
        cursor.execute(query1, (recipe_id,))
        connection.commit()

    except mysql.connector.Error:
        connection.rollback()
        raise
    finally:
        cursor.close()

    return True