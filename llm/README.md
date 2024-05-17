## llm

### Install Package

OpenAI

```
npm install openai
```

langchain

```
npm install langchain
npm install @langchain/openai @langchain/community hnswlib-node
```

Faiss Vectorstore

```
npm install -S faiss-node
```

PDFLoader

```
npm install pdf-parse
```

### 수정 필요한 부분

1. sentiment prompt - 현재는 예외 처리 ..

- 입력한 카테고리 외 카테고리가 함께 반환됨
- '중립'이 함께 답변 -> '긍정', '부정'으로만 답변
