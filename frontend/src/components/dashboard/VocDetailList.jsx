import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';

const TitleContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 23px;
`;

const CategoryTitle = styled.div`
    color: #333;
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 600;
`;

const VocContainer = styled.div`
    width: 90%;
    margin-left: 23px;
    gap: 20px;
`;

const Sentiment = styled.div`
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 5px;
    color: ${props => props.sentiment === 'positive' ? '#005834' : props.sentiment === 'negative' ? '#930000' : '#727272'};
`;

const Voc = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #000;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    line-height: normal;
    border-radius: 5px;
    border: 1px solid #DFDFDF;
    background: #FFF;
    padding: 12px;
    margin-top: 10px;
`;

const VocDate = styled.div`
    color: #8A8A8A;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 5px;
`;

const VocDetailList = ({ categoryId }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [vocList, setVocList] = useState([]);
    const [categoryName, setCategoryName] = useState('카테고리 이름');

    useEffect(() => {
        const fetchVocList = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const accessToken = userInfo ? userInfo.accessToken : null;
                const memberId = userInfo ? userInfo.memberId : null;

                if (!accessToken || !memberId || !categoryId) return;

                const response = await axios.get(`http://15.165.14.203/api/voc/get/latest/${memberId}/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.data && response.data.vocList && Array.isArray(response.data.vocList)) {
                    setVocList(response.data.vocList);
                    setCategoryName(response.data.categoryName);
                } else {
                    console.error('Invalid vocList data format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching vocList:', error);
            }
        };
        fetchVocList();
    }, [categoryId]);

    return (
        <>
            <TitleContainer>
                <CategoryTitle>{categoryName}</CategoryTitle>
            </TitleContainer>
            <VocContainer>
                {vocList.map((vocItem, index) => (
                    <Voc key={index}>
                        <Sentiment sentiment={vocItem.primarySentiment}>
                            {vocItem.primarySentiment === 'positive' && 'Positive'}
                            {vocItem.primarySentiment === 'negative' && 'Negative'}
                        </Sentiment>
                        <div>{vocItem.description}</div>
                        <VocDate>{vocItem.uploadedDate}</VocDate>
                    </Voc>
                ))}
            </VocContainer>
        </>
    );
};

VocDetailList.propTypes = {
    categoryId: PropTypes.string.isRequired,
};

export default VocDetailList;
