import { useState, useEffect } from 'react'
import RecipeCard from './RecipeCard.tsx'
import './RecipeGrid.css'

interface RecipesResponse {
    recipes: any[]
}

interface RecipeData {
    name: string
    type: string
}

const RecipeGrid = () => {
    const [items, setItems] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        fetch("http://localhost:8000/recipes")
            .then((res) => res.json())
            .then((json: RecipesResponse) => {
                setItems(json.recipes)
                setIsLoaded(true)
            })
    }, [])

    if (!isLoaded) {
        return (
            <>
                <h1>Loading Recipes</h1>
            </>
        )
    } else {
        return (
            <>
                <h1>Recipes</h1>
                <div className="mainGrid">
                    {items.map((item: RecipeData) => (
                        <RecipeCard name={item.name} type={item.type}/>
                    ))}
                </div>
            </>
        )
    }

}

export default RecipeGrid