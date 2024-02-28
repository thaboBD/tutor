import os
from langchain.agents import load_tools, initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

# Set environment variables
os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")
os.environ['WOLFRAM_ALPHA_APPID'] = os.getenv("WOLFRA_MALPHA_API_ID")


# Initialize the ChatGPT model
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")

# Load tools and set up memory
tools = load_tools(["wolfram-alpha"], llm=llm)
memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True)

# Initialize the agent
agent_chain = initialize_agent(
    tools, llm, handle_parsing_errors=True, verbose=True, memory=memory)


def run_agent(question):
    response = agent_chain.run(input=question)
    return response
