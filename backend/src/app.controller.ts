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
    return "Hello 11M !";
  }

  @Get("/test/time")
  async testTime(){
    const date:Date = new Date();
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log(date);
    return date.toLocaleDateString() + date.toLocaleTimeString();
  }
}
