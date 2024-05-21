import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function sentiment_analysis(review, category) {
  const content = `
    카테고리: ${category}
    리뷰: ${review}
    
    다음 리뷰를 분석해서 카테고리 리스트에 해당하는 카테고리 각각에 대해 긍정적인지 부정적인지 판단해줘.
    대답은 다른 추가적인 설명 없이 '긍정' 또는 '부정' 둘 중 하나의 단어만 사용해서 다음 형태로 대답해줘.

    { "${category[0]}": "긍정/부정", ... }
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "너는 고객의 리뷰가 긍정적인지 부정적인지 분석하는 언어모델이야.",
      },
      { role: "user", content: content },
    ],
  });

  let result;
  try {
    result = JSON.parse(response.choices[0].message.content);
  } catch (e) {
    // 예외 수정 필요
    result = response.choices[0].message.content;
  }
  return result;
}
