from fastapi import UploadFile, File, FastAPI
from typing import List
from pdf_util import extract_pdf_text

app = FastAPI()

# This will store our content indexed by some identifier
content_index = {}


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


@app.get("/search/")
def search_content(query: str):
    # A simple search mechanism (this can be improved greatly with proper search algorithms)
    results = {key: value for key, value in content_index.items()
               if query in value}

    return results
