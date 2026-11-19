// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard.tsx";
import "./RecipeGrid.css";

interface RecipesResponse {
    recipes: any[];
}

interface RecipeData {
    id: number;
    name: string;
    type: string;
    steps: string;
}

const RecipeGrid = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        fetch("http://localhost:8000/recipes")
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`${res.status}`);
                }
            })
            .then((json: RecipesResponse) => {
                setRecipes(json.recipes);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    if (error) {
        const errorStatus = error.substring(0, 2);
        const errorCat = `https://http.cat/${errorStatus}`;
        return (
            <>
                <h1>Error Loading Recipes</h1>
                <p>{error}</p>
                <img src={errorCat} className="errorImage" />
            </>
        );
    } else if (!isLoaded) {
        return (
            <>
                <h1>Loading Recipes</h1>
            </>
        );
    } else {
        return (
            <>
                <h1>Recipes</h1>
                <div className="mainGrid">
                    {recipes.map((recipe: RecipeData) => (
                        <Link
                            to={{
                                pathname: "/recipe",
                                search: `?id=${recipe.id}`,
                            }}
                            className="unhighlighted">
                            <RecipeCard
                                name={recipe.name}
                                type={recipe.type}
                                key={recipe.id}
                            />
                        </Link>
                    ))}
                </div>
                <Link to="/add" className="addButton">
                    <button>
                        <img src="/add.svg" />
                    </button>
                </Link>
            </>
        );
    }
};

export default RecipeGrid;
