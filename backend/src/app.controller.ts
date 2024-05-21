import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomOpenAI } from './utils/llm-module';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const testGpt = CustomOpenAI.createNew();
    const classifierResult = await testGpt.categoryClassifier('이 제품은 정말 발림성이 좋아요 최고입니다.', ['발림성'])
    const keywordResult = await testGpt.keywordExtraction(['이 제품은 정말 발림성이 좋아요 최고입니다.', '배송은 느려요'], '배송')
    const sentimentAnalysisResult = await testGpt.sentimentAnalysis('이 제품은 정말 발림성이 좋아요 최고입니다. 배송도 짱짱 빨라요.', ['발림성', '배송'])
    console.log(classifierResult);
    console.log(keywordResult);
    console.log(sentimentAnalysisResult);
    return this.appService.getHello();
  }
}
