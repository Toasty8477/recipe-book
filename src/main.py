# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import sys
from fastapi import FastAPI
from mysql.connector import Error as MySQLError

from database_functions import connect_to_db, add_ingredient, get_all_recipes

from request_class_defs import Ingredient

app = FastAPI()

db_connection = None

# Basic route to test the API
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/add_ingredient")
def add_ingredient_route(ingredient: Ingredient):
    global db_connection
    try:
        add_ingredient(db_connection, ingredient.name, ingredient.type)
    except MySQLError as e:
        return {"error": f"Error adding ingredient: {e}"}
    return {"message": f"Ingredient '{ingredient.name}' added successfully."}

@app.get("/recipes")
def get_all_recipes_route():
    global db_connection
    try:
        recipes = get_all_recipes(db_connection)
    except MySQLError as e:
        return {"error": f"Error retrieving recipes: {e}"}
    return {"recipes": recipes}
    
@app.on_event("startup")
def startup_event():
    global db_connection
    db_connection = connect_to_db()

def main():
    # Connect to the database
    try:
        db_connection = connect_to_db(connection=db_connection)
    except MySQLError as e:
        print(f"Error connecting to MySQL: {e}")
        # Application cannot run without a database connection, so exit with an error code
        sys.exit(1)
        

if __name__ == "__main__":
    main()