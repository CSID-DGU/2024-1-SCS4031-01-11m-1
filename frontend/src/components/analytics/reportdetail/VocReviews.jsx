import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
    width: 94%;
    height: 162px;
    flex-shrink: 0;
    border: 1px solid #DFDFDF;
    background: #FFF;
    padding: 10px;
    overflow-y: auto; 
`;

const List = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #000;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    line-height: normal;
    
    
`;

const ReviewText = styled.p`
    margin: 0;
    padding:3px;
    
    border-bottom: 0.1px solid #b8b8b8;
   
`;



const VocReviews = ({ vocReviews }) => {
    return (
        <Container>
            <List>
                {vocReviews.map((review, index) => (
                    <ReviewText key={index}>{review}</ReviewText>
                ))}
       
            </List>
        </Container>
    );
};

VocReviews.propTypes = {
    vocReviews: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default VocReviews;
