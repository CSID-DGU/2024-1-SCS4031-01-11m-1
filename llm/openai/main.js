import fs from "fs";
import { category_classifier } from "./category_classifier.js";
import { sentiment_analysis } from "./sentiment_analysis.js";

// 제품 하나에 대한 전체 리뷰
const reviews = JSON.parse(
  fs.readFileSync("llm/test_data/test_data.json", "utf8")
);
reviews["카테고리"] = {};

// 사용자가 입력한 카테고리
const categories = ["디자인", "향", "편의성", "발림성", "제형", "가격"];

(async () => {
  for (const review of reviews) {
    const review_category = await category_classifier(
      review["리뷰"],
      categories
    );
    review["카테고리"] = await sentiment_analysis(
      review["리뷰"],
      review_category
    );
    // { "카테고리1": "긍정/부정", ... }
    console.log(review["카테고리"]);
  }
})();
