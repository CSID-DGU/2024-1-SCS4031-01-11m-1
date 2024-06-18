import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import arrowicon from '../../image/arrowicon.png';
import arrowdownicon from '../../image/arrow_down.png';

const CardButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
`;

const CardContainer = styled.div`

    flex-wrap: wrap;
    justify-content: center;
    margin:15px;
`;

const Container = styled.div`
    width: 270px;
    height: 320px;
    flex-shrink: 0;
    border-radius: 10px;
    border: ${({ isSelected }) => (isSelected ? '1px solid #1c3159' : '1px solid #DFDFDF')};
    background: #fff;
    box-shadow: ${({ isSelected }) =>
        isSelected ? '2px 4px 10px 2px rgba(28, 49, 89, 0.6)' : '0px 4px 5px 2px rgba(0, 0, 0, 0.25)'};
    margin: 24px;
    position: relative;
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
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    display: flex;
    width: 200px;
    height: auto;
    margin-left: 30px;
    margin-top: 10px;
    text-align: left;
    white-space: pre-line;
`;

const VOCCountContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: absolute;
    bottom: 40px;
    left: 50px;
    right: 50px;
`;

const VOCCount = styled.div`
    color: #1C3159;
    font-family: Pretendard;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 15px;
    margin-right: 15px;
`;

const VOCBar = styled.div`
    width: 45px;
    height: ${({ height }) => (height / 80) * 100}%; 
    max-height: 80px; 
    background-color: rgba(28, 49, 89, 0.30);
    border-radius: 5px;
`;

const ArrowIcon = styled.img`
    width: 38px;
    height: 28px;
    margin: 8px;
`;

function CategoryCard({ reportSources = [], onSelectCard, vocCount = [] }) {
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        console.log('Received reportSources:', reportSources);
        console.log(vocCount);
    }, [reportSources]);

    const handleCardClick = (index, reportSource) => {
        setSelectedCard(index);
        onSelectCard(reportSource);
    };

    return (
        <CardContainer isSelected={selectedCard !== null}>
            {reportSources.map((reportSource, index) => {
                const vocSummariesArray = reportSource.answer.slice(0, 1) || [];
                const vocSummariesWithHeader = vocSummariesArray.length > 0 ? `\n${vocSummariesArray.join('\n')}` : '';
                const minuteSumWithHeader = reportSource.answer.slice(0, 1).join('\n');
                const vocCountData = vocCount.find(item => item.categoryName === reportSource.categoryName);
                const currentWeekVocCount = vocCountData ? vocCountData.currentWeekVocCount : 0;
                const previousWeekVocCount = vocCountData ? vocCountData.previousWeekVocCount : 0;

            
                const maxCount = Math.max(currentWeekVocCount, previousWeekVocCount);
                const currentWeekHeight = currentWeekVocCount > 0 ? (currentWeekVocCount / maxCount) * 80 : 0;
                const previousWeekHeight = previousWeekVocCount > 0 ? (previousWeekVocCount / maxCount) * 80 : 0;

                return (
                    <CardButton key={index} onClick={() => handleCardClick(index, reportSource)}>
                        <Container isSelected={selectedCard === index}>
                            <Category>{reportSource.categoryName}</Category>
                            <KeywordContainer>
                                {reportSource.keywords.map((keyword, idx) => (
                                    <Keyword key={idx}>{keyword}</Keyword>
                                ))}
                            </KeywordContainer>
                            <VOCCountContainer>
                                <VOCCount>{previousWeekVocCount}</VOCCount>
                                {currentWeekVocCount > previousWeekVocCount && (
                                    <ArrowIcon src={arrowicon} alt="Up arrow" />
                                )}
                                {currentWeekVocCount < previousWeekVocCount && (
                                    <ArrowIcon src={arrowdownicon} alt="Down arrow" />
                                )}
                                <VOCCount>{currentWeekVocCount}</VOCCount>
                            </VOCCountContainer>
                            <MinuteSum>{minuteSumWithHeader}</MinuteSum>
                            <VOCCountContainer>
                                <VOCBar height={previousWeekHeight} />
                                <VOCBar height={currentWeekHeight} />
                            </VOCCountContainer>
                        </Container>
                    </CardButton>
                );
            })}
        </CardContainer>
    );
}

CategoryCard.propTypes = {
    reportSources: PropTypes.array.isRequired,
    vocCount: PropTypes.array.isRequired,
    onSelectCard: PropTypes.func.isRequired
};

export default CategoryCard;
