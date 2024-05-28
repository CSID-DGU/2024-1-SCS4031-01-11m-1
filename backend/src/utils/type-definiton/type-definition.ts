export type customRAGresult = {
    category: string,
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