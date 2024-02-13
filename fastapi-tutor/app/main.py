from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from .pdf_util import extract_pdf_text
# from .semantic_search import get_answer
# from calculator import calculate as calculated
from .langchain_util import run_agent as calculated
from pydantic import BaseModel
import logging
import os
from datetime import datetime
from .mathpix import readImage
from .gpt import getGptResponse
import requests
from pprint import pprint

webhook_url = os.getenv('NODE_JS_WEBHOOK_URL')

logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app = FastAPI()
app.mount("/fast-api", app)

os.makedirs('images', exist_ok=True)

# This will store our content indexed by some identifier
content_index = {}


class QueryModel(BaseModel):
    query: str


class FulfillmentResponse(BaseModel):
    fulfillmentText: str

@app.get("/")
def home():
    return "Welcome to the home page."

class DialogflowPayload(BaseModel):
    # Define a Pydantic model to represent the Dialogflow payload
    queryResult: dict


@app.post("/webhook", response_model=FulfillmentResponse)
async def webhook(info : Request):
    json_request = await info.json()

    intent = json_request["queryResult"]["intent"]["displayName"]
    query = json_request["queryResult"]["queryText"]
    contextNumber = json_request["queryResult"]["outputContexts"][0]["name"].split('/')[-1].split('-')[0]
    imageUrl = json_request["queryResult"]["outputContexts"][0]["name"].split('/')[-1].split('-')[1]

    print(contextNumber)

    result = None
    if(intent == 'calculate'):
        result = await calculate(QueryModel(query=query))
    if(intent == 'exercises'):
        result = await exercises(QueryModel(query=query))
    if(intent == 'search-topic'):
        result = await calculate(QueryModel(query=query))
    if(intent == 'image'):
        print("IMAGE INTENT")
        result = 123

    if result:
        return requests.post(webhook_url, data={'result': result, 'From': contextNumber})


    response = FulfillmentResponse(fulfillmentText=result)

    return response


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

    return 'results'


@app.post("/calculate/")
async def calculate(query: QueryModel):
    results = calculated(query.query)
    return results

@app.post("/exercises/")
async def exercises(query: QueryModel):
    results = getGptResponse(query.query)
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

