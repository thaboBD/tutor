from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from pdf_util import extract_pdf_text
# from semantic_search import get_answer
# from calculator import calculate as calculated
from langchain_util import run_agent as calculated
from pydantic import BaseModel
import logging
import os
from datetime import datetime
from mathpix import readImage
from gpt import getGptResponse

logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


app = FastAPI()

os.makedirs('images', exist_ok=True)

# This will store our content indexed by some identifier
content_index = {}


class QueryModel(BaseModel):
    query: str


@app.get("/")
def home():
    return "Welcome to the home page."


@app.post("/upload/")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    responses = []

    for file in files:
        # Extracting text from uploaded PDF
        pdf_text = extract_pdf_text(file.file)

        # Indexing the extracted content (using file filename as the key for simplicity)
        content_index[file.filename] = pdf_text

        responses.append({"filename": file.filename,
                         "message": "PDF uploaded and indexed successfully."})

    return responses


@app.post("/search/")
def search(query: QueryModel):
    # results = get_answer(query.query)

    return results


@app.post("/calculate/")
async def calculate(query: QueryModel):
    results = calculated(query.query)
    return results


@app.post("/read-image/")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400, detail=f'File type not supported: {file.content_type}')

    try:
        contents = await file.read()
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
        filename = f"images/{timestamp}_{file.filename}"

        with open(filename, 'wb') as f:
            f.write(contents)

        image_string = readImage(filename)
        return JSONResponse(status_code=200, content={"filename": file.filename, "image_string": image_string})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})


@app.post("/exercises/")
async def calculate(query: QueryModel):
    results = getGptResponse(query.query)
    return results
