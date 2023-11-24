from enum import Enum
from twilio_util import sendMessage
import main as api


class ConversationState(Enum):
    GREETING = 1
    IDLE = 2
    SEARCH = 3
    CALCULATE = 4
    READING_IMAGE = 4
    EXERCISES = 5
    CLOSING_CONVERSATION = 7


class Chatbot:
    def __init__(self):
        self.state = ConversationState.GREETING
        self.sender = None
        self.media_url = None
        self.userInput = None

    def handle_greeting(self):
        sendMessage(self.sender, "Hi, I'm a chatbot that can help you with your homework. What do you want to do? \n 1. Search \n 2. Calculate \n 3. Read Image \n 4. Exercises")
        self.state = ConversationState.IDLE

    def handle_idle(self):
        if self.userInput == "1":
            self.state = ConversationState.SEARCH
            sendMessage(self.sender, "What do you want to search?")
        elif self.userInput == "2":
            self.state = ConversationState.CALCULATE
            sendMessage(
                self.sender, "What do you want to calculate? you can type your question or send me an image.")
        elif self.userInput == "3":
            self.state = ConversationState.READING_IMAGE
            sendMessage(self.sender, "Please send me an image.")
        elif self.userInput == "4":
            self.state = ConversationState.EXERCISES
            sendMessage(self.sender, "What do you want to practice?")
        else:
            sendMessage(self.sender, "I don't understand. Please try again.")

    def handle_search(self):
        sendMessage(self.sender, "Searching for " + self.userInput)
        result = api.search(self.userInput)
        sendMessage(self.sender, result)

    def processInput(self, payload):
        self.userInput = payload.Body
        self.sender = payload.From

        if self.state == ConversationState.GREETING:
            self.handle_greeting()
        elif self.state == ConversationState.SEARCH:
            self.handle_search()
        elif self.state == ConversationState.CALCULATE:
            self.handle_calculate()
        elif self.state == ConversationState.READING_IMAGE:
            self.handle_reading_image()
        elif self.state == ConversationState.EXERCISES:
            self.handle_exercises()
        elif self.state == ConversationState.CLOSING_CONVERSATION:
            self.handle_closing_conversation()
        elif self.state == ConversationState.IDLE:
            self.handle_idle()
