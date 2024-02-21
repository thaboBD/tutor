import requests
import json
import os
from dotenv import load_dotenv
import base64
import re

load_dotenv()

app_id = os.getenv('MATHPIX_APP_ID')
app_key = os.getenv('MATHPIX_API_KEY')

api_url = "https://api.mathpix.com/v3/latex"


def readImage(imageURL):
    imageURI = extract_quoted_substring(imageURL)
    print("READING IMAGE", imageURI)
    # # Encode the image in base64 format
    # with open(imageURL, "rb") as image_file:
    #     encoded_string = base64.b64encode(image_file.read()).decode()

    data = {
        "src": imageURI,
        "formats": ["text", "latex_simplified", "asciimath"],
        "ocr": ["math", "text"],
        "text": {
            "transforms": ["rm_spaces", "rm_newlines"]
        }
    }

    headers = {
        "app_id": app_id,
        "app_key": app_key,
        "Content-type": "application/json"
    }

    response = requests.post(api_url, headers=headers, data=json.dumps(data))
    response = response.json()
    print("MATH PIX Reponse",response)
    return response['asciimath']

def extract_quoted_substring(string):
    pattern = r"b?'(.*?)'"

    match = re.search(pattern, string)
    if match:
        return match.group(1)
    else:
        return string

