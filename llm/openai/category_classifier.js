import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function category_classifier(review, category) {
  const content = `
    카테고리: ${category}
    리뷰: ${review}
    
    다음 리뷰를 분석해서 제시한 카테고리 리스트 중 어떤 카테고리에 속하는지 판단해줘.
    `;

  const tools = [
    {
      type: "function",
      function: {
        name: "predict_category_of_VOC",
        description: "주어진 고객 리뷰가 어떤 카테고리에 속하는지 예측한다.",
        parameters: {
          type: "object",
          properties: {
            prediction: {
              type: "array",
              items: { type: "string", enum: category },
              description: "예측된 카테고리",
            },
          },
          required: ["prediction"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: content }],
    tools: tools,
  });

  const result = JSON.parse(
    response.choices[0].message.tool_calls[0].function.arguments
  );
  return result.prediction;
}
