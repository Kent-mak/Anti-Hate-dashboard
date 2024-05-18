from fastapi import FastAPI
from Model import eval

app = FastAPI()


@app.get("/")
async def root(text: str):
    print(text)
    output = eval(text)
    print(output)
    return output
    