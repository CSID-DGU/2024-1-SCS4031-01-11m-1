import { KeywordAnswer} from "src/utils/type-definiton/type-definition";
  
export class ReportSource{
  categoryName: string;
  keywords: string[];
  positiveAnswer: KeywordAnswer[];
  negativeAnswer: KeywordAnswer[];
  positiveCnt: number;
  negativeCnt: number;

  constructor(
  categoryName: string,
  keywords: string[],
  positiveAnswer: KeywordAnswer[],
  negativeAnswer: KeywordAnswer[],
  positiveCnt: number,
  negativeCnt: number
  ){
    this.categoryName=categoryName;
    this.keywords=keywords;
    this.positiveAnswer=positiveAnswer;
    this.negativeAnswer=negativeAnswer;
    this.positiveCnt=positiveCnt;
    this.negativeCnt=negativeCnt;
  };

  static create(categoryName:string, keywords: string[], positiveAnswer:KeywordAnswer[], negativeAnswer:KeywordAnswer[], positiveCnt:number, negativeCnt:number){
    return new ReportSource(categoryName, keywords, positiveAnswer, negativeAnswer, positiveCnt, negativeCnt);
  };
};