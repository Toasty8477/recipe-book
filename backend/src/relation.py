# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

class Relation:
    id: int
    name: str
    type: str

    def __init__(self, id: int, name: str, type: str):
        self.id = id
        self.name = name
        self.type = type