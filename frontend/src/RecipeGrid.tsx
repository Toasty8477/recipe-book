import { useState, useEffect } from 'react'

const RecipeGrid = () => {
    const [items, setItems] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/recipes")
            .then((res) => res.json())
            .then((json) => {
                setItems(json)
                setIsLoaded(true)
            })
    }, [])

    if (!isLoaded) {
        return (
            <div>
                <h1>Loading Recipes</h1>
            </div>
        )
    }
    return (
        <div>
            <h1>Recipes</h1>
            <p>{items}</p>
        </div>
    )

}

export default RecipeGrid