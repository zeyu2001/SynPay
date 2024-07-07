from langchain.chains.openai_functions.openapi import get_openapi_chain
from langchain_openai import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import UnstructuredURLLoader

llm = ChatOpenAI(model="gpt-4o")

url = input("Enter a URL to summarize (either a webpage or a YouTube video): ")


if "youtube.com" in url:
    youtube_summarizer_chain = get_openapi_chain(
        "http://localhost:3000/api/agents/cly7a3t850009fd8ogytxa7k6/openapi",
        llm,
        verbose=True,
        headers={
            'X-Agent-Id': 'cly7aenwf000bfd8o33w56ou0',
        }
    )

    result = youtube_summarizer_chain(url)


else:
    prompt_template = """Write a summary of the following in 250-300 words:

                        {text}

                    """
    prompt = PromptTemplate(template=prompt_template, input_variables=["text"])

    summarize_chain = load_summarize_chain(
        llm, chain_type="stuff", prompt=prompt)

    loader = UnstructuredURLLoader(urls=[url], ssl_verify=False, headers={
                                   "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"})
    data = loader.load()

    result = summarize_chain.run(data)


prompt_template = """This JSON contains results from a summarization job. Parse it and return only the relevant summary, in a human-readable form.

                        {result}

                    """

prompt = PromptTemplate(template=prompt_template,
                        input_variables=["result"])

result_parser_chain = prompt | llm | StrOutputParser()

response = result_parser_chain.invoke({"result": result})

print(response)
