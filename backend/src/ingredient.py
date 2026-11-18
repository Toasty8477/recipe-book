class Ingredient:
    name: str
    type: str
    quantity: float
    unit: str

    def __init__(self, name: str, type: str, quantity: float, unit: str):
            self.name = name
            self.type = type
            self.quantity = quantity
            self.unit = unit