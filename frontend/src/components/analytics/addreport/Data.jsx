import React, { useState } from 'react';
import styled from 'styled-components';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const Container = styled.div`
    width: 305px;
    max-height: 80px;
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

function Data() {
    const [selectedData, setSelectedData] = useState(null);
    const data = ['1', '2'];

    const handleItemClick = (item) => {
        setSelectedData(item);
    };

    return (
        <>
            <Title>Data</Title>
            <Container>
                {data.map((item, index) => (
                    <Item 
                        key={index} 
                        isSelected={selectedData === item}
                        onClick={() => handleItemClick(item)}
                    >
                        {item}
                    </Item>
                ))}
            </Container>
        </>
    );
}

export default Data;
