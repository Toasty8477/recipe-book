# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

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