import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomOpenAI } from './llm/llm-module';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly customOpenAI:CustomOpenAI
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const testGpt = this.customOpenAI;
    const classifierResult = await testGpt.categoryClassifier('이 제품은 정말 발림성이 좋아요 최고입니다.', ['발림성','배송','색감'])
    const keywordResult = await testGpt.keywordExtraction(['배송이 빨리요', '배송은 느려요'], '배송')
    const sentimentAnalysisResult = await testGpt.sentimentAnalysis('이 제품은 정말 발림성이 좋아요 최고입니다. 배송은 많이 느린 것 같아요.', ['발림성', '배송'])
    console.log(classifierResult);
    console.log(keywordResult);
    console.log(sentimentAnalysisResult);
    return this.appService.getHello();
  }
}
