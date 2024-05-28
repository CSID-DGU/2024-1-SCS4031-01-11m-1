import { KeywordAnswer, KeywordSource } from "src/utils/type-definiton/type-definition";
  
export class CategoryAnalysisSourceDto{
  categoryName: string;
  keywordSources: KeywordSource[];
  positiveAnswer: KeywordAnswer[];
  negativeAnswer: KeywordAnswer[];
  positiveCnt: number;
  negativeCnt: number;

  constructor(
  categoryName: string,
  keywordSources: KeywordSource[],
  positiveAnswer: KeywordAnswer[],
  negativeAnswer: KeywordAnswer[],
  positiveCnt: number,
  negativeCnt: number
  ){
    categoryName = this.categoryName;
    keywordSources = this.keywordSources;
    positiveAnswer = this.positiveAnswer;
    negativeAnswer = this.negativeAnswer;
    positiveCnt = this.positiveCnt;
    negativeCnt = this.negativeCnt
  };

  static create(categoryName:string, keywordSources: KeywordSource[], positiveAnswer:KeywordAnswer[], negativeAnswer:KeywordAnswer[], positiveCnt:number, negativeCnt:number){
    return new CategoryAnalysisSourceDto(categoryName, keywordSources, positiveAnswer, negativeAnswer, positiveCnt, negativeCnt);
  };
};