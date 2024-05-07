import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from "./Navbar";
import Tab from "../components/management/Tab"
import ProductTable from "../components/management/ProductTable";
import MeetingMinutesTable from "../components/management/MeetingMinutesTable";
import CategoryTable from "../components/management/CategoryTable"

const Container = styled.div`
    width: 100%;
    height: 83vh;
    background-color: #F5F7FA;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    align-items: center; 
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 27px;
    margin-left: 57px;
`;

const ListContainer = styled.div`
    width: 95%;
    height: 100%; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
`;

function Management() {
    const [activeTab, setActiveTab] = useState('Product');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <>
            <Navbar />
            <Title>Management</Title>
            <Container>
                <ListContainer>
                    <Tab onTabChange={handleTabChange} />
                    {activeTab === 'Product' && <ProductTable />}
                    {activeTab === 'Meeting Minutes' && <MeetingMinutesTable />}
                    {activeTab === 'Category' && <CategoryTable />}
                    
                </ListContainer>
            </Container>
        </>
    );
}

export default Management;
