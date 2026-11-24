// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton.tsx";
import "./RecipeCard.css";

interface RecipeCardProps {
    name: string;
    type: string;
    id: number;
    updateHook: Function
}

const RecipeCard = ({ name, type, id, updateHook }: RecipeCardProps) => {
    return (
        <div className="recipeCard">
            <Link
                to={{
                    pathname: "/recipe",
                    search: `?id=${id}`,
                }}
                className="unhighlighted">
                <div>
                    <h3>{name}</h3>
                    <p>{type}</p>
                </div>
            </Link>
            <DeleteButton id={id} updateHook={updateHook} />
        </div>
    );
};

export default RecipeCard;
