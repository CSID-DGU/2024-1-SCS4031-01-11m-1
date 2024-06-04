import React from 'react';
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
    width: 300px;
    height: 350px;
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #1c3159;
    background: #fff;
    box-shadow: 2px 4px 10px 2px rgba(28, 49, 89, 0.6);
    margin: 30px;
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

function CategoryCard() {
    return (
        <CardContainer>
            <CardButton>
                <Container>
                    <Category>카테고리</Category>
                    <KeywordContainer>
                        <Keyword>키워드1</Keyword>
                        <Keyword>키워드2</Keyword>
                    </KeywordContainer>
                </Container>
            </CardButton>
            <CardButton>
                <Container>
                    <Category>카테고리</Category>
                    <KeywordContainer>
                        <Keyword>키워드1</Keyword>
                        <Keyword>키워드2</Keyword>
                    </KeywordContainer>
                </Container>
            </CardButton>
            {/* Repeat for other containers */}
        </CardContainer>
    );
}

export default CategoryCard;
