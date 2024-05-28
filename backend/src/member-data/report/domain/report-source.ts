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
    categoryName = this.categoryName;
    keywords = this.keywords;
    positiveAnswer = this.positiveAnswer;
    negativeAnswer = this.negativeAnswer;
    positiveCnt = this.positiveCnt;
    negativeCnt = this.negativeCnt
  };

  static create(categoryName:string, keywords: string[], positiveAnswer:KeywordAnswer[], negativeAnswer:KeywordAnswer[], positiveCnt:number, negativeCnt:number){
    return new ReportSource(categoryName, keywords, positiveAnswer, negativeAnswer, positiveCnt, negativeCnt);
  };
};