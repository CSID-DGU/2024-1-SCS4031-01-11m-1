import React from 'react';
import styled from 'styled-components';
import KeywordDetail from './KeywordDetail';
import MinuteDetail from './MinuteDetail';
import Sentiment from './Sentiment';

const Category = styled.div`
    color: #333;
    font-family: 'Pretendard';
    font-size: 25px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 30px;
    margin-left: 45px;
`;

const DetailContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px; /* Add any additional styling you need here */
`;

function CategoryDetail() {
    return (
        <>
            <Category>카테고리</Category>
            <KeywordDetail />
            <DetailContainer>
                <MinuteDetail />
                <Sentiment />
            </DetailContainer>
        </>
    );
}

export default CategoryDetail;
