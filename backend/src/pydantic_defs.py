from pydantic import BaseModel

class IngredientModel(BaseModel):
    name: str
    type: str
    quantity: float | None
    unit: str | None

class RecipeModel(BaseModel):
    name: str
    type: str
    steps: str
    ingredients: list[IngredientModel]