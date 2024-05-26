import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

export async function category_classifier(review, category) {
  const content = `
    카테고리: ${category}
    리뷰: ${review}
    
    리뷰에서 언급하는 카테고리만 찾아줘.
    `;

  const tools = [
    {
      type: "function",
      function: {
        name: "clustering_category_of_VOC",
        description: "리뷰가 속하는 카테고리를 찾는다.",
        parameters: {
          type: "object",
          properties: {
            prediction: {
              type: "array",
              items: { type: "string", enum: category },
              description: "리뷰가 속하는 카테고리",
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
    // temperature: 0,
  });

  // parsing error 예외처리
  try {
    const result = JSON.parse(
      response.choices[0].message.tool_calls[0].function.arguments
    );
    return result.prediction;
  } catch (e) {
    return [];
  }
  // const result = JSON.parse(
  //   response.choices[0].message.tool_calls[0].function.arguments
  // );
  // return result.prediction;
}
