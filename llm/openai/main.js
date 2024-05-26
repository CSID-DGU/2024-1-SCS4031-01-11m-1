import fs from "fs";
import { category_classifier } from "./category_classifier.js";
import { sentiment_analysis } from "./sentiment_analysis.js";
import { rag } from "./rag.js";

// 제품 하나에 대한 전체 리뷰
const reviews = JSON.parse(
  fs.readFileSync("llm/test_data/test_data.json", "utf8")
);
reviews["카테고리"] = {};

// 사용자가 입력한 카테고리
const categories = ["효과", "보습", "편의성"];

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
  // test_category_data.json
  // console.log(reviews);

  // { "카테고리1": { "긍정": ["리뷰", "리뷰", ...], "부정": ["리뷰", "리뷰", ...] }, "카테고리2": { ... }, ... }
  // test_category_cluster_data.json
  // console.log(categoryReview);

  const minute = await rag("llm/test_data/회의록_0522.pdf", categoryReview);
  // { "카테고리1": { "긍정": { "키워드": "회의록 언급 내용", "키워드": "회의록 언급 내용" }, "부정": { "키워드": "회의록 언급 내용", "키워드": "회의록 언급 내용" } }, … }
  // test_summary.json -> 요약문 결과
  // test_keyword_rag.json -> 키워드, 회의록 언급 내용
  console.log(minute);
})();
