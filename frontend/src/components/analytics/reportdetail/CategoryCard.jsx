import React, { useState } from 'react';
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
    height: 370px;
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
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    display: flex;
    width: 203px;
    height: 40px;
    align-items: flex-start;
    margin-left: 30px;
    margin-top: 10px;
`;

const MinuteSum = styled.div`
    color: #333;
    font-family: Pretendard;
    display: flex;
    width: 203px;
    height: 40px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 30px;
    margin-top: 10px;
`;

function CategoryCard({ cards = [], onCardClick }) {
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (reportSource) => {
        setSelectedCard(reportSource);
        onCardClick(reportSource);
        console.log(reportSource.categoryName); 
    };

    return (
        <CardContainer>
    
            {cards.flatMap((card, index) => (
                card.reportSources.map((reportSource, sourceIndex) => (
                    <CardButton key={`${index}-${sourceIndex}`} onClick={() => handleCardClick(reportSource)}>
                        <Container isSelected={selectedCard === reportSource}>
                            <Category>{reportSource.categoryName}</Category>
                            <KeywordContainer>
                                {reportSource.keywords.map((keyword, idx) => (
                                    <Keyword key={idx}>{keyword}</Keyword>
                                ))}
                            </KeywordContainer>
                            <ReviewSum>{reportSource.vocSummaries.join(', ')}</ReviewSum>
                            <MinuteSum>{reportSource.answer.join(', ')}</MinuteSum>
                        </Container>
                    </CardButton>
                ))
            ))}
        </CardContainer>
    );
}

CategoryCard.propTypes = {
    cards: PropTypes.array.isRequired,
    onCardClick: PropTypes.func.isRequired
};

export default CategoryCard;
