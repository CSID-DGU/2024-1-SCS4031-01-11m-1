import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 98%;
    margin: auto;
    margin-top: 29px;
`;

const LineContainer = styled.div`   
    width: 98%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    align-items: left;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: flex-start;
    gap: 24px;
`;

const TabButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
`;

const TabButton = styled.button`
    color: ${({ active }) => active ? '#1C3159' : '#B4B4B4'};
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    border: none;
    cursor: pointer;
    background-color: transparent;
    padding: 0; 
`;

const Line = styled.div`
    width: ${({ active }) => active ? '100%' : '0'};
    height: 2px;
    background: #1C3159;
    transition: width 0.3s ease; 
    margin-top: 8px;
`;

const FullLine = styled.div`
    width: 100%;
    height: 2px;
    background: #D9D9D9;
    z-index: 10;
`;

function Tab() {
    const [activeTab, setActiveTab] = useState('Product');

    const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    onTabChange(tabName); // Call the onTabChange callback
};


    return (
        <Container>
            <LineContainer>
                
                <TabContainer>
                    <TabButtonContainer>
                        <TabButton active={activeTab === 'Product'} onClick={() => handleTabClick('Product')}>Product</TabButton>
                        <Line active={activeTab === 'Product'} />
                    </TabButtonContainer>
                    <TabButtonContainer>
                        <TabButton active={activeTab === 'Meeting Minutes'} onClick={() => handleTabClick('Meeting Minutes')}>Meeting Minutes</TabButton>
                        <Line active={activeTab === 'Meeting Minutes'} />
                    </TabButtonContainer>
                    <TabButtonContainer>
                        <TabButton active={activeTab === 'Category'} onClick={() => handleTabClick('Category')}>Category</TabButton>
                        <Line active={activeTab === 'Category'} />
                    </TabButtonContainer>
                </TabContainer>
                <FullLine />
            </LineContainer>
        </Container>
    );
}

export default Tab;
