import './RecipeCard.css'

interface RecipeCardProps {
    name: string
    type: string
}

const RecipeCard = ({ name, type }: RecipeCardProps) => {
    return (
        <div className="recipeCard">
            <h3>{name}</h3>
            <p>{type}</p>
        </div>
    )
}

export default RecipeCard