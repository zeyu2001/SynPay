from langchain.chains.openai_functions.openapi import get_openapi_chain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

chain = get_openapi_chain(
    "http://localhost:3000/api/agents/cly4g3c15000dc1wgy0h6sx74/openapi",
    llm,
    verbose=True
)

result = chain.run(
    """What's the summary of this video? https://www.youtube.com/watch?v=upC8hjr2b4g&ab_channel=fern"""
)

print(result)
