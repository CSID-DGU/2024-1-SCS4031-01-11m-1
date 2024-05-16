import fs from "fs";
import { category_classifier } from "./category_classifier.js";

// 제품 하나에 대한 전체 리뷰
const reviews = JSON.parse(
  fs.readFileSync("llm/test_data/test_data.json", "utf8")
);
reviews["카테고리"] = {};

const test_reviews = reviews.slice(0, 3);

// 사용자가 입력한 카테고리
const categories = ["디자인", "향", "편의성", "발림성", "제형", "가격"];

(async () => {
  for (const review of test_reviews) {
    review["카테고리"] = await category_classifier(review["리뷰"], categories); // { '편의성': '긍정', '가격': '부정', '제형': '긍정' }
  }

  console.log(test_reviews);
})();
