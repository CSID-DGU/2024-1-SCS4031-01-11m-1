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
  async getHello(): Promise<any> {
    const testGpt = this.customOpenAI;
    const classifierResult = await testGpt.categoryClassifier('이 제품은 정말 발림성이 좋아요 최고입니다.', ['발림성','배송','색감'])
    const keywordResult = await testGpt.keywordExtraction(['배송이 빨리요', '배송은 느려요'], '배송')
    const sentimentAnalysisResult = await testGpt.sentimentAnalysis('이 제품은 정말 발림성이 좋아요 최고입니다. 배송은 많이 느린 것 같아요.', ['발림성', '배송'])
    const ragResult = await testGpt.customRAG(['배송', '품질'],['민감도', '저자극'],['부작용', '배송', '가격',],`/Users/yun-yeongheon/11m/backend/uploads/files/áá¬áá´áá©á¨1716873401915.pdf`)
    console.log(classifierResult);
    console.log(keywordResult);
    console.log(sentimentAnalysisResult);
    console.log('------------------------------------');
    console.log(ragResult[0].sentiment.긍정);
    return ragResult;
  }

  @Get("/test/time")
  async testTime(){
    const date:Date = new Date();
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log(date);
    return date.toLocaleDateString() + date.toLocaleTimeString();
  }
}
