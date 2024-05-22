import React from 'react';
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

const Container = styled.div`
    width: 305px;
    max-height: 173px;
    flex-shrink: 0;
    overflow-y: auto;
    &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  } 
`;

const Item = styled.div`
  color: #333;
  font-family: "Pretendard";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 0px;
  cursor: pointer; 
  padding: 13px;
  &:hover {
    background-color: rgba(28, 49, 89, 0.30);
  }
`;



function Product() {
const products = ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 6', 'Product 7', 'Product 8', 'Product 9', 'Product 10'];
  return (
    <>
        <Title>Product</Title>
        <Container>
            {products.map((product, index) => (
                <Item key={index}>{product}</Item>
            ))}
        </Container>
        
    </>
  )
}

export default Product