import './App.css'
import RecipeGrid from './RecipeGrid.tsx'
import RecipeAdd from './RecipeAdd.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <RecipeGrid/>
    </>
  )
}

const AddRecipe = () => {
  return (
    <>
      <RecipeAdd/>
    </>
  )
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/add" element={<AddRecipe/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
