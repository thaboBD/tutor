# from semantic_search import create_embeddings, get_answer
# from calculator import calculate
# from langchain_util import run_agent
from gpt import getGptResponse
# The code tests the semantic search
'''index = create_embeddings()
while True:
    user_input = input("Enter a value (type 'exit' to quit): ")
    if user_input == 'exit':
        break
    else:
        ans = get_answer(user_input)
    # Do something with the user input
    print("You entered:", user_input)
    print(index)
    print(ans)'''

'''
# this code test the calculator
while True:
    user_input = input("Enter a value (type 'exit' to quit): ")
    if user_input == 'exit':
        break
    else:
        ans = run_agent(user_input)
    # Do something with the user input
    print("You entered:", user_input)
    print(ans)
    '''

while True:
    user_input = input("Enter a value (type 'exit' to quit): ")
    if user_input == 'exit':
        break
    else:
        ans = getGptResponse(user_input)
    # Do something with the user input
    print("You entered:", user_input)
    print(ans)
