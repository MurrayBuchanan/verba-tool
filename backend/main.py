# Placeholder: https://realpython.com/get-started-with-fastapi/

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}