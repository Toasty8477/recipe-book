// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IngredientListing from "./IngredientListing.tsx";
import "./RecipeAdd.css";

interface Ingredient {
    name: string;
    type: string;
    quantity: number;
    unit: string;
}

interface Recipe {
    id: number;
    name: string;
    type: string;
    steps: string;
    ingredients: Ingredient[];
}

interface CreatedResponse {
    message: string;
    recipe: Recipe;
}

interface OkResponse {
    message: string;
    id: number;
}

const RecipeAdd = () => {
    const navigate = useNavigate();
    const [ingredientCount, setIngredientCount] = useState<number>(1);
    const [ingredients, setIngredients] = useState<React.ReactElement[]>([
        <IngredientListing id={ingredientCount} />,
    ]);
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [steps, setSteps] = useState<string>("Step 1.");

    const addIngredientListing = () => {
        setIngredientCount((current) => current + 1);
        setIngredients(
            // ingredientCount+1 is a workaround for state shenanigans
            ingredients.concat([<IngredientListing id={ingredientCount+1} />]),
        );
    };

    const removeIngredientListing = () => {
        if (ingredientCount > 1) {
            setIngredients((current) => current.slice(0, -1));
            setIngredientCount((current) => current - 1);
        }
    };

    const handleForm = (formData: FormData) => {
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const ingredients = [];

        for (var i = 0; i < ingredientCount; i++) {
            ingredients.push({
                name: formData.get("ingredient" + (i + 1) + "Name"),
                type: "none",
                quantity: formData.get("ingredient" + (i + 1) + "Quantity"),
                unit: formData.get("ingredient" + (i + 1) + "Unit"),
            });
        }

        const requestBody = {
            name: formData.get("name"),
            type: formData.get("type"),
            steps: formData.get("steps"),
            ingredients: ingredients,
        };

        console.log(requestBody);

        fetch("http://localhost:8000/recipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => {
                if (res.status == 201 || res.status == 200) {
                    return res.json();
                } else {
                    console.log(res.json());
                    throw new Error(`${res.status}`);
                }
            })
            .then((json: CreatedResponse | OkResponse) => {
                if (
                    json.message === "Recipe with the same name already exists"
                ) {
                    navigate({
                        pathname: "/recipe",
                        search: `?id=${(json as OkResponse).id}`,
                    });
                } else {
                    navigate({
                        pathname: "/recipe",
                        search: `?id=${(json as CreatedResponse).recipe.id}`,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                console.log(err.json());
            });
    };

    return (
        <>
            <h1>Add Recipe</h1>
            <form action={handleForm}>
                <div className="recipeAddGrid">
                    <div className="recipeFields">
                        <h2>Recipe Details</h2>
                        <div className="details container">
                            <div className="formField">
                                <label>Recipe Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="formField">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}>
                                    <option value="Main">Main</option>
                                    <option value="Side">Side</option>
                                    <option value="Dessert">Dessert</option>
                                </select>
                            </div>
                        </div>
                        <div className="container">
                            <div className="formField">
                                <label>Recipe Instructions</label>
                                <textarea
                                    name="steps"
                                    value={steps}
                                    rows={20}
                                    onChange={(e) => setSteps(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="ingredientFields">
                        <h2>Ingredients</h2>
                        <div className="container">
                            {ingredients}
                            <div>
                                <button
                                    type="button"
                                    onClick={addIngredientListing}
                                    className="ingredientButton">
                                    Add Ingredient
                                </button>
                                <button
                                    type="button"
                                    onClick={removeIngredientListing}
                                    className="ingredientButton">
                                    Remove Ingredient
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="formButtons">
                        <Link to="/" className="no">
                            <button type="button" className="cancelButton">
                                Cancel
                            </button>
                        </Link>
                        <input
                            className="submitButton"
                            type="submit"
                            value="Submit"
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default RecipeAdd;
