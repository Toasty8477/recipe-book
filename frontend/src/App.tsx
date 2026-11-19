// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import "./App.css";
import RecipeGrid from "./RecipeGrid.tsx";
import RecipeAdd from "./RecipeAdd.tsx";
import RecipeView from "./RecipeView.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = () => {
    return (
        <>
            <RecipeGrid />
        </>
    );
};

const AddRecipe = () => {
    return (
        <>
            <RecipeAdd />
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/recipe" element={<RecipeView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
