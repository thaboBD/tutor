import openai
import os
from bs4 import BeautifulSoup
import re

from dotenv import load_dotenv


load_dotenv()


openai.api_key = os.getenv("OPENAI_API_KEY")


def getGptResponse(prompt):
    intent = sanitize_Input(prompt)
    messages = []
    messages.append(
        {"role": "system", "content": "You are a Math Tutor when given some context you will generate 5 questions of different difficulty to help reinforce the learning of the concept. You will generate 2 easy questions, 2 intermdiate and 1 hard question in terms of difficulty. Respond with only the questions. The string return should be in ASCII charaters only."})

    question = {}
    question['role'] = 'user'
    question['content'] = intent
    messages.append(question)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages)

    try:
        answer = response['choices'][0]['message']['content']
    except IndexError:
        answer = 'Looks like theres an issue. Please try again later'

    answer = remove_html(answer)
    answer = convert_defrac_to_fraction(answer)

    return answer


def getWorking(prompt):
    intent = sanitize_Input(prompt)
    messages = []
    messages.append(
        {"role": "system", "content": "You are a Math Tutor. You'll be given a math question and what the answer is. I would like you to return detailed steps on how to get to the answer from the problem if possible. Explain as simple and concisely as possible while convering math concepts. The string return should be in ASCII charaters only. After showing the working generate a similar question to the one given. The question should be different but similar in difficulty. This is to reinforce the learning of the user. label the question with text like here is a practice question. show the working in steps from 1 to n. The string return should be in ASCII charaters only."})

    question = {}
    question['role'] = 'user'
    question['content'] = intent
    messages.append(question)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages)

    try:
        answer = response['choices'][0]['message']['content']
    except IndexError:
        answer = 'Looks like theres an issue. Please try again later'

    answer = remove_html(answer)
    answer = convert_defrac_to_fraction(answer)

    return answer


def sanitize_Input(text):
    text = remove_html_tags(text)
    text = remove_extra_spaces(text)
    text = lowercase_text(text)
    text = limit_input_length(text)
    return text


def remove_html_tags(text):
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text()


def remove_extra_spaces(text):
    return ' '.join(text.split())


def lowercase_text(text):
    return text.lower()


def limit_input_length(text, max_length=500):
    return text[:max_length]


def remove_html(text):
    soup = BeautifulSoup(text.replace("\\", ""), "html.parser")
    return soup.get_text()


def convert_defrac_to_fraction(text):
    # Regular expression pattern to match "[defrac{num}{den}]"
    pattern = r"\[defrac{(\d+)}{(\d+)}\]"
    # Find all matches of the pattern in the text
    matches = re.findall(pattern, text)

    for match in matches:
        # Create the fraction representation "num/den"
        fraction = f"{match[0]}/{match[1]}"
        # Replace "[defrac{num}{den}]" with "num/den"
        text = text.replace(f"[defrac{match[0]}{match[1]}", fraction)

    return text
