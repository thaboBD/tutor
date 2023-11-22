from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
client = Client(account_sid, auth_token)


def sendMessage(mobnum, message):
    print("Mobile number : ", mobnum)
    print("Message is : ", message)
    try:
        message = client.messages.create(
            from_='whatsapp:+14155238886',
            body=message,
            to=mobnum
        )
        print(message.sid)
    except Exception as e:
        print("Error: Twilio Api issue")
        print(e)


def sendMessageWithMedia(mobnum, message, file_url):
    print("Mobile number : ", mobnum)
    print("Message is : ", message)
    # Add a print statement to check if the media URL is correct
    print(f"Media URL: {file_url}")
    try:
        text = client.messages.create(
            from_='whatsapp:+14155238886',
            body=message,
            to=mobnum)

        message = client.messages.create(
            from_='whatsapp:+14155238886',
            media_url=[file_url],
            to=mobnum
        )
        print(message.sid)
    except Exception as e:
        print("Error: Twilio Api issue")
        print(e)
