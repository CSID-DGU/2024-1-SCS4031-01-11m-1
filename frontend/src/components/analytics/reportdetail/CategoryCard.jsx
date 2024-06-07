import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
`;

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const Container = styled.div`
    width: 270px;
    height: 320px;
    flex-shrink: 0;
    border-radius: 10px;
    border: ${({ isSelected }) => (isSelected ? '1px solid #1c3159' : '1px solid #DFDFDF')};
    background: #fff;
    box-shadow: ${({ isSelected }) => (isSelected ? '2px 4px 10px 2px rgba(28, 49, 89, 0.6)' : '0px 4px 5px 2px rgba(0, 0, 0, 0.25)')};
    margin: 24px;
`;

const Category = styled.div`
    color: #000;
    font-family: "Wanted Sans";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 23px;
    margin-left: 30px;
    text-align: left;
`;

const KeywordContainer = styled.div`
    display: flex;
    gap: 10px;
    padding: 10px;
    flex-wrap: wrap;
    margin-left: 18px;
    margin-top: 5px;
`;

const Keyword = styled.div`
    color: #1c3159;
    font-family: 'Wanted Sans';
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    display: flex;
    padding: 6px 11px;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    background: #bbc1cd;
`;

const ReviewSum = styled.div`
    color: #333;
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    display: flex;
    width: 220px;
    height: auto;
    align-items: flex-start;
    margin-left: 30px;
    margin-top: 10px;
    text-align: left;
    white-space: pre-line;
`;

const MinuteSum = styled.div`
    color: #333;
    font-family: Pretendard;
    display: flex;
    width: 200px;
    height: auto;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 30px;
    margin-top: 10px;
    text-align: left;
    white-space: pre-line;
`;

function CategoryCard({ reportSources = [], onSelectCard }) {
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        console.log('Received reportSources:', reportSources);
    }, [reportSources]);

    const handleCardClick = (index, reportSource) => {
        setSelectedCard(index);
        onSelectCard(reportSource);
    };

    return (
        <CardContainer>
            {reportSources.map((reportSource, index) => {
                const vocSummariesArray = reportSource.vocSummaries[0]?.split('.').slice(0, 1) || [];
                const vocSummariesWithHeader = `\n${vocSummariesArray.join('\n')}`;
                const minuteSumWithHeader = `\n${reportSource.answer.slice(0, 2).join('\n')}`;

                return (
                    <CardButton key={index} onClick={() => handleCardClick(index, reportSource)}>
                        <Container isSelected={selectedCard === index}>
                            <Category>{reportSource.categoryName}</Category>
                            <KeywordContainer>
                                {reportSource.keywords.map((keyword, idx) => (
                                    <Keyword key={idx}>{keyword}</Keyword>
                                ))}
                            </KeywordContainer>
                            {/* <ReviewSum>{vocSummariesWithHeader}</ReviewSum> */}
                            <MinuteSum>{minuteSumWithHeader}</MinuteSum>
                        </Container>
                    </CardButton>
                );
            })}
        </CardContainer>
    );
}

CategoryCard.propTypes = {
    reportSources: PropTypes.array.isRequired,
    onSelectCard: PropTypes.func.isRequired
};

export default CategoryCard;
