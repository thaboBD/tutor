from fastapi import UploadFile, File, FastAPI
from typing import List
from pdf_util import extract_pdf_text
from semantic_search import get_answer
from calculator import calculate as calculated
from pydantic import BaseModel
import logging

logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


app = FastAPI()

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
    results = get_answer(query.query)

    return results


@app.post("/calculate/")
async def calculate(query: QueryModel):
    results = calculated(query.query)
    return results
