import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function category_classifier(review, category) {
  const content = `
    사용자 카테고리: ${category}
    리뷰: ${review}
    
    리뷰가 사용자 카테고리 리스트에 대해서 이야기하고 있는지 파악하고, 리뷰에서 언급되는 카테고리들만 review_category라고 정의할게.

    이때, review_category에 대해 리뷰가 긍정인지 부정인지 각각 파악해줘. 대답은 다른 추가 설명 없이 언급이 없는 카테고리는 제외하고, 언급된 카테고리에 대해서만 다음 딕셔너리 형태로 대답해줘.

    { "review_category1": "긍/부정", "review_category2": "긍/부정", ... }
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "너는 고객의 리뷰를 카테고리별로 분류하고, 분류된 카테고리에 대해 긍정적인지 부정적인지 분석하는 언어모델이야.",
      },
      { role: "user", content: content },
    ],
  });

  const result = response.choices[0].message.content;
  return JSON.parse(result);
}
