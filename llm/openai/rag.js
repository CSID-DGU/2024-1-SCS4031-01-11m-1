import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { keyword_extraction } from "./keyword_extraction.js";

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

  const minutes = {};
  const categories = Object.keys(reviews);

  for (const category of categories) {
    minutes[category] = { 긍정: {}, 부정: {} };

    // 긍정 키워드 도출
    const positive_keywords = await keyword_extraction(
      reviews[category]["긍정"],
      category
    );

    // 긍정 키워드에 대한 검색 결과
    for (const keyword of positive_keywords) {
      const content = `
      해당 문서 안에 ${category}와 관련된 내용들 중 ${keyword}에 대한 내용이 등장하는지 파악해줘.
      만약 관련 내용이 있다면, '${category}에서 ${keyword}에 대한 논의가 ____ 이루어졌습니다.' 라고 답변해줘. 이때, 어떤 식으로 이루어졌는지 ___ 부분에 간단하게 요약해서 설명해줘.
      관련 내용을 찾을 수 없으면 다른 설명 없이 '추가적인 논의가 필요합니다.' 라고 답변해줘.
      `;

      const response = await chain.invoke(content);
      const result = response.content;
      minutes[category]["긍정"][keyword] = result;
    }

    // 부정 키워드 도출
    const negative_keywords = await keyword_extraction(
      reviews[category]["부정"],
      category
    );

    // 부정 키워드에 대한 검색 결과
    for (const keyword of negative_keywords) {
      const content = `
      해당 문서 안에 ${category}와 관련된 내용들 중 ${keyword}에 대한 내용이 등장하는지 파악해줘.
      만약 관련 내용이 있다면, '${category}에서 ${keyword}에 대한 논의가 ____ 이루어졌습니다.' 라고 답변해줘. 이때, 어떤 식으로 이루어졌는지 ___ 부분에 간단하게 요약해서 설명해줘.
      관련 내용을 찾을 수 없으면 다른 설명 없이 '추가적인 논의가 필요합니다.' 라고 답변해줘.
      `;

      const response = await chain.invoke(content);
      const result = response.content;
      minutes[category]["부정"][keyword] = result;
    }
  }
  return minutes;
}
