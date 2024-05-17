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

2. 키워드 추출할 때

- 긍/부정 의미 더 고려하게
- 데이터 많을 때 token error 발생 -> 한 번에 처리 X

3. RAG 답변 생성 부분 디테일하게 작성
