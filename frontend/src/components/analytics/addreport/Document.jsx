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
    border-radius: 2.5px;
    border: 1px solid #D9D9D9;  
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
    background-color: ${({ isSelected }) => (isSelected ? 'rgba(28, 49, 89, 0.30)' : 'transparent')};
    &:hover {
        background-color: rgba(28, 49, 89, 0.30);
    }
`;

function Document() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const products = [
        'Document 1', 'Document 2', 'Document 3', 'Document 4', 
        'Document 5', 'Document 6', 'Document 7', 'Document 8', 
        'Document 9', 'Document 10'
    ];

    const handleItemClick = (document) => {
        setSelectedProduct(document);
    };

    return (
        <>
            <Title>Document</Title>
            <Container>
                {products.map((document, index) => (
                    <Item 
                        key={index} 
                        isSelected={selectedProduct === document}
                        onClick={() => handleItemClick(document)}
                    >
                        {document}
                    </Item>
                ))}
            </Container>
        </>
    )
}

export default Document;
