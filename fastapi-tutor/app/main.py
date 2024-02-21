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
import aiohttp
import asyncio
import urllib.parse
import aioredis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
NODE_JS_WEBHOOK_URL = os.getenv('NODE_JS_WEBHOOK_URL')

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

@app.post("/webhook", response_model=FulfillmentResponse)
async def webhook(info : Request):
    print("WHEBHOOK CALLED")
    intent, query, context_number, image_url = await extract_data_from_request(info)
    result = await decide_intent_find_result(intent, query, image_url)
    response = FulfillmentResponse(fulfillmentText=result)

    if result and context_number:
        await send_webhook_request(result, context_number, query)

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

async def extract_data_from_request(info):
    try:
        redis = await aioredis.Redis.from_url("redis://redis")
        json_request = await info.json()
        query_result = json_request.get("queryResult", {})
        output_contexts = query_result.get("outputContexts", [])
        output_context = output_contexts[0]["name"] if output_contexts else None


        intent = query_result.get("intent", {}).get("displayName", None)
        query = query_result.get("queryText", None)
        context_number = None
        image_url = None

        '''
            'specialidentifier' in outputContext is
                true when the endpoint is hit through node js app
                false when the endpoint is hit through dialog-flow
        '''
        if 'specialidentifier' in output_context:
            data = output_context.split('/')[-1].split('<[]()[]>')
            if len(data) >= 2:
                context_number = data[1]

            image_url = await redis.get(context_number)
            if image_url:
                await redis.delete(context_number)

        return intent, query, context_number, image_url
    except Exception as e:
        print("Exception occurred while extracting data from request:", e)
        return None, None, None, None

async def decide_intent_find_result(intent, query, image_url):
    if intent == 'calculate':
        return await calculate(QueryModel(query=query))
    elif intent == 'exercises':
        return await exercises(QueryModel(query=query))
    elif intent == 'search-topic':
        return await calculate(QueryModel(query=query))
    elif intent == 'read-image' and image_url:
        image_data = readImage(image_url)
        query = str(image_data)
        return await calculate(QueryModel(query=query))
    else:
        return ''

async def send_webhook_request(result, context_number, query):
        webhook_url = NODE_JS_WEBHOOK_URL

        data = {'result': result, 'From': context_number, 'query': query}
        async with aiohttp.ClientSession() as session:
            async with session.post(webhook_url, data=data) as response:
                return await response.text()
