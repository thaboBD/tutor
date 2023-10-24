from semantic_search import create_embeddings, get_answer

index = create_embeddings()

while True:
    user_input = input("Enter a value (type 'exit' to quit): ")
    if user_input == 'exit':
        break
    else:
        ans = get_answer(user_input)
    # Do something with the user input
    print("You entered:", user_input)
    print(index)
    print(ans)
