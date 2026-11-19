// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import "./RecipeCard.css";

interface RecipeCardProps {
    name: string;
    type: string;
}

const RecipeCard = ({ name, type }: RecipeCardProps) => {
    return (
        <div className="recipeCard">
            <h3>{name}</h3>
            <p>{type}</p>
        </div>
    );
};

export default RecipeCard;
