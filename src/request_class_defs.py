from pydantic import BaseModel

class Ingredient(BaseModel):
    name: str
    type: str