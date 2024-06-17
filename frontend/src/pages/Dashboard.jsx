import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import VocChart from '../components/dashboard/VocChart';
import CategoryVocTable from '../components/dashboard/CategoryVocTable';
import VocDetailList from '../components/dashboard/VocDetailList';

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #F5F7FA;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 20px;
    font-weight: 600;
    margin-top: 27px;
    margin-left: 40px;
`;

const TrendContainer = styled.div`
    width: ${props => props.showDetail ? '63%' : '90%'};
    height: 100%; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
    margin-top: 25px;
    transition: width 0.3s ease-in-out;
`;

const ChartContainer = styled.div`
    width: 100%;
    height: 100%; 
    display: flex;  
    flex-direction: column; 
    align-items: center; 
`;

const SubTitle = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 15px;
    font-weight: 600;
    margin: 20px;
`;

const VocDetailContainer = styled.div`
    width: ${props => props.showDetail ? '30%' : '0'};
    height: 107vh; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
    margin-left: 30px;
    margin-top: 25px;
    overflow-y: auto; 
    transition: width 0.3s ease-in-out;
`;

function Dashboard() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <>
            <Navbar />
            <Title>Dashboard</Title>
            <Container>
                <TrendContainer showDetail={selectedCategoryId !== null}>
                    <SubTitle>Category Trends</SubTitle>
                    <ChartContainer>
                        <VocChart />
                    </ChartContainer>
                    <CategoryVocTable onSelectCategory={handleCategorySelect} />
                </TrendContainer>
                <VocDetailContainer showDetail={selectedCategoryId !== null}>
                    <SubTitle>Voc Detail</SubTitle>
                    {selectedCategoryId && <VocDetailList categoryId={selectedCategoryId} />}
                </VocDetailContainer>
            </Container>
        </>
    );
}

export default Dashboard;
