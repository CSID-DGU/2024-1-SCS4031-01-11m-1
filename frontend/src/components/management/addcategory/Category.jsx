import React, { useState } from 'react';
import styled from 'styled-components';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 20px;
`;

const Box = styled.div`
    position: relative;
    width: 253px;
    height: 23px;
    flex-shrink: 0;
    border: 0.5px solid #D9D9D9;
    background: #F2F2F2;
    margin-top: 9px;
    display: flex;
    align-items: center;
    padding-left: 10px;
`;

const NameInput = styled.input`
    width: calc(100% - 30px);
    height: 100%;
    border: none;
    background: transparent;
    color: #333;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    outline: none;
`;

const Condition = styled.div`
    position: absolute;
    right: 10px;
    bottom: 0;
    color: #727272;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 30px;
`;

function Category({ onChange }) {
    const [categoryName, setCategoryName] = useState('');
    const [overflow, setOverflow] = useState(false);

    const handleChange = (event) => {
        const input = event.target.value;
        if (input.length <= 30) {
            setOverflow(false);
            setCategoryName(input);
            onChange(input);
        } else {
            setOverflow(true);
        }
    };

    return (
        <>
            <Title>Category</Title>
            <Box>
                <NameInput
                    type="text"
                    value={categoryName}
                    onChange={handleChange}
                    placeholder="카테고리를 입력해주세요"
                />
                <Condition overflow={overflow}>{categoryName.length}/30</Condition>
            </Box>
        </>
    );
}

export default Category;
