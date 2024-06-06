import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sentiment from './Sentiment';
import {motion } from 'framer-motion';

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
  margin-top: 25px;
  margin-left: 25px;
`;

const KeywordsContainer = styled.div`
  margin-top: 25px;
  margin-left: 40px;
`;

const SubTitle = styled.div`
    color: #1C3159;
    font-family: "Wanted Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
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
  margin-top: 15px;
`;

const Answer = styled.div`
    white-space: pre-line;
    color: #333;
    font-family: 'Pretendard';
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.5px;
    width:305px;
    line-height:30px;
    margin-top:10px;
`;

const SumContainer = styled.div`
    margin-top: 25px;
    margin-left: 40px;
`;

const VocSumWrapper = styled.div`
    height: 240px;
    white-space: pre-line;
    width: 590px;
    margin-left: 5px;
    margin-top:10px;
    letter-spacing: 0.5px;
    color: #000;
    font-family: Pretendard;
    font-size: 15px;
    font-style:normal;
    font-weight: 400;
    line-height: 30px;
`;

const MinuteContainer = styled.div`
    margin-top: 30px;
    margin-left: 40px;
`;

const SentimentContainer = styled.div`
    margin-top: 20px;
    margin-left:20px;
`;

const RowContainer = styled.div`
    display:flex;
`;
const CategoryDetail = ({ reportSource }) => {
    useEffect(() => {
        console.log('Received reportSource:', reportSource);
    }, [reportSource]);

    const VocSummary = reportSource.vocSummaries.length > 0 ? reportSource.vocSummaries[0] : ''; // vocSummaries 배열의 길이가 1 이상이면 Summary를 설정, 아니면 빈 문자열로 설정
    const formattedVocSummaries = VocSummary ? VocSummary.split('.').map((sentence, index, array) => {
        if (index === array.length - 1) {
            return null; // 마지막 항목은 표시하지 않음
        }
        return `• ${sentence.trim()}\n`; // 글머리 기호와 줄바꿈 추가
    }) : [];

    const formattedAnswer = reportSource.answer.map((sentence) => {
        return `• ${sentence.trim()}\n`; 
    }).join('');

    return (
        <DetailContainer>
               
                <CategoryName>{reportSource.categoryName}</CategoryName>
                <KeywordsContainer>
                    <SubTitle>Keyword</SubTitle>
                    {reportSource.keywords.map((keyword, index) => (
                        <Keyword key={index}>{keyword}</Keyword>
                    ))}
                </KeywordsContainer>
                <SumContainer>
                    <SubTitle>Voc Summary</SubTitle>
                    <VocSumWrapper>
                        {formattedVocSummaries.map((sentence, index) => (
                            <div key={index}>{sentence}</div>
                        ))}
                    </VocSumWrapper>
                    </SumContainer>
                <RowContainer>
                    <MinuteContainer>
                        <SubTitle>Minute</SubTitle>
                        <Answer>{formattedAnswer}</Answer>
                    </MinuteContainer>
                    <SentimentContainer>
                        <SubTitle>Sentiment</SubTitle>
                        <Sentiment positiveCnt={reportSource.positiveCnt} negativeCnt={reportSource.negativeCnt} />
                    </SentimentContainer>
                    
                        
                </RowContainer>
                
                
        </DetailContainer>
    );
};

CategoryDetail.propTypes = {
    reportSource: PropTypes.shape({
        categoryName: PropTypes.string.isRequired,
        keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
        vocSummaries: PropTypes.arrayOf(PropTypes.string).isRequired,
        answer: PropTypes.string.isRequired,
        positiveCnt: PropTypes.number.isRequired,
        negativeCnt: PropTypes.number.isRequired,
    }).isRequired,
};

export default CategoryDetail;
