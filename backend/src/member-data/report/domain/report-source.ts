export class ReportSource{
  categoryName: string;
  keywords: string[];
  vocSummaries: string[];
  vocReviews: string[];
  answer: string[];
  positiveCnt: number;
  negativeCnt: number;

  constructor(
  categoryName: string,
  keywords: string[],
  vocSummaries: string[],
  vocReviews: string[],
  answer: string[],
  positiveCnt: number,
  negativeCnt: number
  ){
    this.categoryName=categoryName;
    this.keywords=keywords;
    this.vocSummaries = vocSummaries;
    this.vocReviews = vocReviews;
    this.answer = answer;
    this.positiveCnt=positiveCnt;
    this.negativeCnt=negativeCnt;
  };

  static create(categoryName:string, keywords: string[], vocSummaries: string[],vocReviews: string[], answer:string[], positiveCnt:number, negativeCnt:number){
    return new ReportSource(categoryName, keywords, vocSummaries, vocReviews, answer, positiveCnt, negativeCnt);
  };
};