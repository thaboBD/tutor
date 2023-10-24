import os
import openai
import pinecone
import functools
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI


load_dotenv()

directory = 'data'
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"),
              environment=os.getenv("PINECONE_ENV"))
openai.api_key = os.getenv("OPENAI_API_KEY")


def load_docs(directory):
    loader = DirectoryLoader(directory)
    documents = loader.load()
    return documents


documents = load_docs(directory)
print("the number of documents is " + str(len(documents)))


def split_docs(documents, chunk_size=1000, chunk_overlap=20):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    docs = text_splitter.split_documents(documents)
    return docs


@functools.lru_cache(maxsize=None)
def create_embeddings():
    documents = load_docs(directory)
    documents = split_docs(documents)

    embeddings = OpenAIEmbeddings()
    query_result = embeddings.embed_query("Hello world")
    print(len(query_result))

    index_name = "algebra"
    index = Pinecone.from_documents(
        documents, embeddings, index_name=index_name)
    return index


index = create_embeddings()


def get_similiar_docs(query, k=2, score=False):

    if score:
        similar_docs = index.similarity_search_with_score(query, k=k)
    else:
        similar_docs = index.similarity_search(query, k=k)
    return similar_docs


llm = ChatOpenAI(model_name="gpt-3.5-turbo")

chain = load_qa_chain(llm, chain_type="stuff")


def get_answer(query):
    similar_docs = get_similiar_docs(query)
    answer = chain.run(input_documents=similar_docs, question=query)
    return answer
