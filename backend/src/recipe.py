class Recipe:
    id: int
    name: str
    type: str
    instructions: str

    def __init__(self, id: int, name: str, type: str, instructions: str):
        self.id = id
        self.name = name
        self.type = type
        self.instructions = instructions
