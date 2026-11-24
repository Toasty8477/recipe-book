import "./DeleteButton.css"

interface Props {
    id: number
    updateHook: Function
}

const DeleteButton = ({id, updateHook}: Props) => {

    const deleteItem = () => {
        fetch(`http://localhost:8000/recipe?id=${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`${res.status}`)
            }
            updateHook()
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <button type="button" onClick={deleteItem} className="deleteButton">
            <img src="/delete.svg" />
        </button>
    )
}

export default DeleteButton