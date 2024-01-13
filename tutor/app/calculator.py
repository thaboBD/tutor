import os
import requests
import xml.etree.ElementTree as ET

from dotenv import load_dotenv

load_dotenv()

wolfram_app_id = os.getenv("WOLFRA_MALPHA_API_ID")

base_url = "http://api.wolframalpha.com/v2/query"

# a function to get the answer from wolfram alpha using base_url and wolfram_app_id


def replace_plus(question):
    if '+' in question:
        updated_question = question.replace('+', 'plus')
        return updated_question
    return question


def calculate(question):
    question = replace_plus(question)
    url = base_url + "?appid=" + wolfram_app_id + \
        "&input=" + question + "&format=plaintext"
    response = requests.get(url)
    response.raise_for_status()
    print(url)
    response.text

    root = ET.fromstring(response.text)

    # Find the 'Solution' pod
    solution_pod = root.find(".//pod[@title='Result']")  # Updated this line

    # Find the 'plaintext' element under the 'subpod'
    plaintext = solution_pod.find("./subpod/plaintext").text

    return plaintext
