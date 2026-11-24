import { useState } from "react";
import "./IngredientListing.css";

const IngredientListing = ({ id }: { id: number }) => {
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [unit, setUnit] = useState<string>("");

    return (
        <>
            <div className="ingredientListing">
                <div className="ingredientField">
                    <label>Ingredient</label>
                    <input
                        type="text"
                        name={"ingredient" + id + "Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="ingredientField">
                    <label>Amount</label>
                    <input
                        type="number"
                        name={"ingredient" + id + "Quantity"}
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </div>
                <div className="ingredientField">
                    <label>Unit</label>
                    <select
                        name={"ingredient" + id + "Unit"}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}>
                        <optgroup label="Imperial">
                            <option value="Teaspoon">Teaspoon</option>
                            <option value="Tablespoon">Tablespoon</option>
                            <option value="Ounce">Ounce</option>
                            <option value="Cup">Cup</option>
                            <option value="Pint">Pint</option>
                            <option value="Quart">Quart</option>
                            <option value="Gallon">Gallon</option>
                        </optgroup>
                        <optgroup label="Metric">
                            <option value="Gram">Gram</option>
                            <option value="Kilogram">Kilogram</option>
                            <option value="Milliliter">Milliliter</option>
                            <option value="Liters">Liter</option>
                        </optgroup>
                    </select>
                </div>
            </div>
        </>
    );
};

export default IngredientListing;
