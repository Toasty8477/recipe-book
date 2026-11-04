# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import sys
from fastapi import FastAPI
from mysql.connector import Error as MySQLError

from database_functions import connect_to_db

app = FastAPI()

# Basic route to test the API
@app.get("/")
async def root():
    return {"message": "Hello World"}


def main():
    # Connect to the database
    try:
        connect_to_db()
    except MySQLError as e:
        print(f"Error connecting to MySQL: {e}")
        # Application cannot run without a database connection, so exit with an error code
        sys.exit(1)
        

if __name__ == "__main__":
    main()