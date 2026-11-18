import { useState, useEffect } from 'react'
import './RecipeView.css'

interface Ingredient {
    name: string
    type: string
    quantity: number
    unit: string
}

interface Recipe {
    id: number
    name: string
    type: string
    steps: string
    ingredients: Ingredient[]
}

const RecipeView = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [recipe, setRecipe] = useState<Recipe | any>();
    const [error, setError] = useState<string>()

    const urlParams = new URLSearchParams(window.location.search)
    const recipeId = urlParams.get("id")

    useEffect(() => {
        fetch(`http://localhost:8000/recipe?id=${recipeId}`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(`${res.status}`)
                }
            })
            .then((json: Recipe) => {
                setRecipe(json)
                setIsLoaded(true)
            })
            .catch((error) => {
                setError(error.message)
            })
    }, [])


    if (error) {
        const errorStatus = error.substring(0, 2)
        const errorCat = `https://http.cat/${errorStatus}`
        return (
            <>
                <h1>Error Loading Recipes</h1>
                <p>{error}</p>
                <img src={errorCat} className="errorImage"/>
            </>
        )
    } else if (!isLoaded) {
        return (
            <>
                <h1>Loading Recipe</h1>
            </>
        )
    } else {
        return (
            <>
                <h1>{recipe.name}</h1>
                <div className="container">
                    <div className="instructions">
                        <h2>Steps</h2>
                        <p>{recipe.steps}</p>
                    </div>
                    <div className="ingredients">
                        <h2>Ingredients</h2>
                        {recipe.ingredients.map((ingredient: Ingredient) => {
                            return <p key={ingredient.name} className='ingredient'>
                                {ingredient.quantity} {ingredient.quantity > 1 ? ingredient.unit + "s" : ingredient.unit} {ingredient.name}
                            </p>
                        })}
                    </div>
                </div>
            </>
        )
    }
}

export default RecipeView