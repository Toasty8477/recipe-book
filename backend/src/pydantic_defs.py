from pydantic import BaseModel

class IngredientModel(BaseModel):
    name: str
    type: str
    quantity: float
    unit: str