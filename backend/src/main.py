# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import sys
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error as MySQLError

from database_functions import connect_to_db, add_ingredient, get_all_recipes, get_recipe_by_id, get_related_recipes, add_recipe, get_recipes_by_name

from pydantic_defs import IngredientModel, RecipeModel
from ingredient import Ingredient
from recipe import Recipe
from relation import Relation

app = FastAPI()

origins = [
    "http://localhost:4173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

db_connection = None

# Basic route to test the API
@app.get("/")
async def root():
    return {"message": "Your API connection is working"}

@app.get("/recipes")
def get_all_recipes_route():
    global db_connection
    response = []

    try:
        # Read all recipes from the database
        recipes = get_all_recipes(db_connection)
    except MySQLError:
        # If an error occurs return code 500
        raise HTTPException(status_code=500, detail="A database error occurred")

    # For each recipe in the select output, map its values to an object then add to a list
    for recipe in recipes:
        response.append(Recipe(recipe[0], recipe[1], recipe[2], "Steps are not returned by this request"))
    # Return the list of recipe objects
    return {"recipes": response}

@app.get("/recipe")
async def get_recipe_by_id_route(id: int = 0):
    global db_connection

    if id <= 0:
        raise HTTPException(status_code=400, detail="id parameter less than 1 or not specified")

    try:
        recipe_all = get_recipe_by_id(db_connection, id)

        if not len(recipe_all) > 1:
            raise HTTPException(status_code=404, detail="Recipe could not be found")

        recipe = recipe_all[0]
        ingredients = []

        for recipe_row in recipe_all:
            ingredients.append(Ingredient(recipe_row[6], recipe_row[7], recipe_row[4], recipe_row[5]))

    except MySQLError as e:
        # If an error occurs return code 500
        raise HTTPException(status_code=500, detail=f"A database error occurred")   

    return {
            "id": id,
            "name": recipe[1],
            "type": recipe[2],
            "steps": recipe[3],
            "ingredients": ingredients
        }

@app.get("/recipe/related")
async def get_related_recipes_route(id: int = 0):
    global db_connection

    if id <= 0:
            raise HTTPException(status_code=400, detail="id parameter less than 1 or not specified")

    try:
        relations = get_related_recipes(db_connection, id)
        related = []

        for relation in relations:
            related.append(Relation(relation[2], relation[3], relation[4]))

    except MySQLError as e:
            # If an error occurs return code 500
            raise HTTPException(status_code=500, detail=f"A database error occurred") 

    return related


@app.post("/add_ingredient")
def add_ingredient_route(ingredient: IngredientModel):
    global db_connection
    try:
        add_ingredient(db_connection, ingredient.name, ingredient.type)
    except MySQLError as e:
        return {"error": f"Error adding ingredient: {e}"}
    return {"message": f"Ingredient '{ingredient.name}' added successfully."}

@app.post("/recipe", status_code=201)
def add_recipe_route(recipe: RecipeModel, response: Response):
    global db_connection

    try:
        existing_recipes = get_recipes_by_name(db_connection, recipe.name)
        if not len(existing_recipes) == 0:
            response.status_code = 200
            return {
                "message": "Recipe with the same name already exists"
            }

    except MySQLError as e:
        raise HTTPException(status_code=500, detail="A database error occurred")

    # Add ingredients if they don't already exist
    try:
        for ingredient in recipe.ingredients:
            add_ingredient(db_connection, ingredient.name, ingredient.type)

    except MySQLError as e:
        raise HTTPException(status_code=500, detail="A database error occurred while adding ingredients")

    try:
        recipe_id = add_recipe(db_connection, recipe.name, recipe.type, recipe.steps, recipe.ingredients)

    except MySQLError as e:
        raise HTTPException(status_code=500, detail="A database error occurred while adding recipe")

    return {
        "message": "Recipe added successfully",
        "recipe": {
            "id": recipe_id,
            "name": recipe.name,
            "steps": recipe.steps,
            "ingredients": recipe.ingredients
        }
    }
    
    
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