import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import * as process from 'process';

@Injectable()
export class CustomOpenAI {
  private readonly openai = new OpenAI({apiKey: `${process.env.OPENAI_KEY}`});
  static createNew():CustomOpenAI {
    return new CustomOpenAI();
  };

  async categoryClassifier(review: string, categories: string[]){
    const content: string = `
    카테고리: ${categories}
    리뷰: ${review}
    
    다음 리뷰를 분석해서 제시한 카테고리 리스트 중 어떤 카테고리에 속하는지 판단해줘.
    `;

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[]= [
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
            items: { type: "string", enum: categories },
            description: "예측된 카테고리",
            },
          },
          required: ["prediction"],
          },
        },
      },
    ];

    const response: OpenAI.Chat.Completions.ChatCompletion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      //model: "gpt-4-turbo",
      temperature: 0.2,
      messages: [{ role: "user", content: content }],
      tools: tools,
    });

    const result = JSON.parse(
      response.choices[0].message.tool_calls[0].function.arguments
    );
    return result.prediction;
  };

  async chunkSummarize(reviews: string[], category: string): Promise<string[]>{
    // 리뷰데이터 100개씩 요약문 만들기
    const chuck_size:number = 100;
    const totalChunks:number = Math.ceil(reviews.length / chuck_size);
    let summarizes:string[] = [];

    for (let i = 0; i < totalChunks; i++) {
        const startIdx:number = i * chuck_size;
        const endIdx:number = Math.min((i + 1) * chuck_size, reviews.length);
        const chunk:string[] = reviews.slice(startIdx, endIdx);

        const content:string = `
        리뷰: ${chunk}

        위 리뷰를 ${category} 카테고리에 대한 내용에 초점을 맞춰서 요약해줘.
        추가 설명 없이 요약된 내용만 답변해줘.
        `;

        const response: OpenAI.Chat.Completions.ChatCompletion
          = await this.openai.chat.completions.create({
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
  };

  async keywordExtraction(reviews: string[], category: string): Promise<string[]>{
    const summarize_reviews:string[] = await this.chunkSummarize(reviews, category);
    const content:string = `
        리뷰: ${summarize_reviews}
    
        위 리뷰들을 ${category} 카테고리에 대한 내용에 초점을 맞춰서 분석할 때,
        어떤 단어가 중요한 지 파악해줘.
        대답은 다른 추가적인 설명 없이 중요 단어 2가지를 ["keyword1", "keyword2"] 형태로 대답해줘.
        `;

    const response: OpenAI.Chat.Completions.ChatCompletion
      = await this.openai.chat.completions.create({
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
  };

  async sentimentAnalysis(review: string, categories: string[]){
    const content = `
        카테고리: ${categories}
        리뷰: ${review}
        
        다음 리뷰를 분석해서 카테고리 리스트에 해당하는 카테고리 각각에 대해 긍정적인지 부정적인지 판단해줘.
        대답은 다른 추가적인 설명 없이 '긍정' 또는 '부정' 둘 중 하나의 단어만 사용해서 다음 형태로 대답해줘.

        { "${categories[0]}": "긍정/부정", ... }
        `;

    const response = await this.openai.chat.completions.create({
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
    } catch (error) {
        // 예외 수정 필요
        result = response.choices[0].message.content;
    }
    return result;
  };
}