import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const api_key = "";

export async function rag(pdf_path, reviews) {
  const loader = new PDFLoader(pdf_path);
  const docs = await loader.load();

  const vectorstores = await FaissStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      apiKey: api_key,
    })
  );

  const retriever = vectorstores.asRetriever();

  const template = `
  Answer the question based only on the following context, and
  Strictly Use ONLY the following pieces of context to answer the question at the end:
  {context}

  Question: {question}
  `;
  const prompt = PromptTemplate.fromTemplate(template);

  const chat_model = new ChatOpenAI({
    apiKey: api_key,
  });

  const chain = RunnableSequence.from([
    {
      context: retriever,
      question: new RunnablePassthrough(),
    },
    prompt,
    chat_model,
  ]);

  // keyword extraction 위치

  // test
  const category = "제형";
  const keyword = "보습";

  const response = await chain.invoke(`
    해당 문서 안에 ${category}와 관련된 내용들 중 ${keyword}에 대한 내용이 등장하는지 파악해줘.

    만약 관련 내용이 있다면 ${category}에서 ${keyword}에 대한 논의가 어떻게 이루어졌는지 알려줘.

    내용이 없다면 다른 설명 없이 '추가적인 논의가 필요합니다.' 라고 답변해줘.
  `);
  const result = response.content;
  return result;
}
