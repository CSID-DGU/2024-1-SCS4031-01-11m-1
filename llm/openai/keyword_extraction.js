import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function keyword_extraction(reviews, category) {
  const content = `
      리뷰: ${reviews}
  
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
