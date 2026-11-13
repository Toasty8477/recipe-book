interface RecipeCardProps {
    name: string
    type: string
}

const RecipeCard = ({ name, type }: RecipeCardProps) => {
    return (
        <div>
            <h3>{name}</h3>
            <p>{type}</p>
        </div>
    )
}

export default RecipeCard