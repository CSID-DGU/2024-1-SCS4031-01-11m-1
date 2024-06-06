import { VocAnalysisEntity } from "src/voc/entity/voc-analysis.entity";

export type customRAGresult = {
    categoryName: string,
    sentiment: {
      긍정: KeywordAnswer[],
      부정: KeywordAnswer[],
    }
  };
  
export type KeywordAnswer = {
  keyword: string,
  answer: any,
}

export type KeywordSource = {
  keyword: string,
  review: string
};

export type VocAnalysisesAndCategory = {
  categoryName: string,
  vocAnalysises: VocAnalysisEntity[]
}

export type KeywordsBySentimentCtg = {
  categotyName: string,
  keywords: string[]
}