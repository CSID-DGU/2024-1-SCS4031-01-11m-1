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

// review를 카테고리/긍부정으로 나눠 저장할 배열 초기화
const categoryReview = {};
categories.forEach((category) => {
  categoryReview[category] = { 긍정: [], 부정: [] };
});

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
    // console.log(review["카테고리"]);

    // 키워드 도출을 위해서 카테고리별 긍정/부정 리뷰 데이터들을 categoryReview에 저장
    for (const [category, sentiment] of Object.entries(review["카테고리"])) {
      if (categoryReview[category] && categoryReview[category][sentiment]) {
        categoryReview[category][sentiment].push(review["리뷰"]);
      }
    }
  }
  // { "카테고리1": { "긍정": ["리뷰", "리뷰", ...], "부정": ["리뷰", "리뷰", ...] }, "카테고리2": { ... }, ... }
  // console.log(categoryReview);
})();
