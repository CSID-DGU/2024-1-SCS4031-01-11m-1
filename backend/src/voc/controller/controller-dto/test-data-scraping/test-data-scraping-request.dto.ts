import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TestDataScrapingRequestDto{

    @ApiProperty({
        example: "크롤링할 url",
        description: "크롤링할 url"
      })
    @IsString()
    private url:string;

    public getUrl():string{
        return this.url;
    }
}