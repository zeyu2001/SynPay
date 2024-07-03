from langchain.chains import APIChain
from langchain_openai import OpenAI
import requests

docs = requests.get(
    "http://localhost:3000/api/agents/cly4g3c15000dc1wgy0h6sx74/openapi").text

llm = OpenAI(temperature=0)
chain = APIChain.from_llm_and_api_docs(
    llm,
    docs,
    verbose=True,
    limit_to_domains=["http://localhost:3000"],
)
chain.run(
    """Which is the most entertaining and lighthearted video to watch?
    1. https://www.youtube.com/watch?v=upC8hjr2b4g&ab_channel=fern
    2. https://www.youtube.com/watch?v=1tBjqwzDmvk
    3. https://www.youtube.com/watch?v=BcVzerhKXOs"""
)
