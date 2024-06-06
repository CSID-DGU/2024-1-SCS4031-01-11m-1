import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const DetailContainer = styled.div`
  margin-top: 20px;
`;

const CategoryName = styled.div`
  color: #333;
  font-family: 'Wanted Sans';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const KeywordsContainer = styled.div`
  margin-top: 10px;
`;

const Keyword = styled.span`
  color: #1c3159;
  font-family: 'Wanted Sans';
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  display: inline-block;
  padding: 6px 11px;
  margin-right: 10px;
  border-radius: 40px;
  background: #bbc1cd;
`;

const AnswerContainer = styled.div`
  margin-top: 20px;
`;

const Answer = styled.div`
  color: #333;
  font-family: 'Pretendard';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 10px;
`;

const CategoryDetail = ({ categoryName, keywords, vocSummaries, answer }) => {
  return (
    <DetailContainer>
      <CategoryName>{categoryName}</CategoryName>
      <KeywordsContainer>
        {keywords.map((keyword, index) => (
          <Keyword key={index}>{keyword}</Keyword>
        ))}
      </KeywordsContainer>
      <AnswerContainer>
        <Answer>{answer}</Answer>
      </AnswerContainer>
    </DetailContainer>
  );
};

CategoryDetail.propTypes = {
  categoryName: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  vocSummaries: PropTypes.arrayOf(PropTypes.string).isRequired,
  answer: PropTypes.string.isRequired,
};

export default CategoryDetail;
