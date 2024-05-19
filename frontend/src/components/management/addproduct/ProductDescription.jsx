import React, { useState } from 'react';
import styled from 'styled-components';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top:20px;
`;

const Box = styled.div`
    position: relative;
    width: 250px;
    height: 122px;
    flex-shrink: 0;
    border: 0.5px solid #D9D9D9;
    background: #F2F2F2;
    margin-top: 9px;
    display: flex;
    align-items: center;
    padding-left: 10px;
`;

const DescriptionInput = styled.textarea`
    width: 239px;
    height: 108px;
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: #333;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    outline: none;
    resize: none;
    overflow: auto; 
`;

const Condition = styled.div`
    position: absolute;
    right: 10px;
    bottom: 0;
    color: ${({ overflow }) => (overflow ? 'red' : '#727272')};
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    margin-top:30px;
`;

function ProductDescription({onChange}) {
  const [productDescription, setProductDescription] = useState('');
  const [overflow, setOverflow] = useState(false);

  const handleChange = (event) => {
    const input = event.target.value;
    if (input.length <= 300) {
      setOverflow(false);
      setProductDescription(input);
      onChange(input);
    } else {
      setOverflow(true);
    }
  };

  return (
    <>
        <Title>Product Description</Title>
        <Box>
            <DescriptionInput 
                value={productDescription} 
                onChange={handleChange} 
                placeholder="상품 설명을 입력해주세요" 
            />
            <Condition overflow={overflow}>{productDescription.length}/300</Condition>
        </Box>
    </>
    
  )
}

export default ProductDescription;
