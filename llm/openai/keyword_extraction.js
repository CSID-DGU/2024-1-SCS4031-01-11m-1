import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

async function chunk_summarize(reviews, category) {
  // 리뷰데이터 50개씩 요약문 만들기
  const chuck_size = 50;
  const totalChunks = Math.ceil(reviews.length / chuck_size);
  let summarizes = [];

  for (let i = 0; i < totalChunks; i++) {
    const startIdx = i * chuck_size;
    const endIdx = Math.min((i + 1) * chuck_size, reviews.length);
    const chunk = reviews.slice(startIdx, endIdx);

    const content = `
    리뷰: ${chunk}

    위 리뷰를 ${category} 카테고리에 대한 내용에 초점을 맞춰서 요약해줘.
    추가 설명 없이 요약된 내용만 답변해줘.
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "너는 문장 요약기야.",
        },
        { role: "user", content: content },
      ],
    });

    const result = response.choices[0].message.content;
    summarizes.push(result);
  }
  return summarizes;
}

export async function keyword_extraction(reviews, category) {
  const summarize_reviews = await chunk_summarize(reviews, category);
  const content = `
      리뷰: ${summarize_reviews}
  
      위 리뷰들을 ${category} 카테고리에 대한 내용에 초점을 맞춰서 분석할 때,
      어떤 단어가 중요한 지 파악해줘.
      대답은 다른 추가적인 설명 없이 중요 단어 2가지를 ["keyword1", "keyword2"] 형태로 대답해줘.
      `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "너는 키워드 추출기야.",
      },
      { role: "user", content: content },
    ],
  });

  const result = response.choices[0].message.content;
  const result_list = JSON.parse(result);
  return result_list;
}
