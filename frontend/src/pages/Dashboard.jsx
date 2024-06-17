import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import VocChart from '../components/dashboard/VocChart';
import CategoryVocTable from '../components/dashboard/CategoryVocTable';
const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #F5F7FA;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    margin-left: 40px;
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 27px;
    margin-left: 40px;
`;

const TrendContainer = styled.div`
    width: 70%;
    height: 100%; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
    

`;

const ChartContainer = styled.div`
    width:100%;
    height: 100%; 
    display: flex;  
    flex-direction: column; 
    align-items: center; 
`;

const SubTitle = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin: 20px;
`;

function Dashboard() {
  return (
    <>
      <Navbar />
      <Title>Dashboard</Title>
      <Container>
        <TrendContainer>
          <SubTitle>Category Trends</SubTitle>
          <ChartContainer>
            <VocChart />
          </ChartContainer>
          <CategoryVocTable />
        </TrendContainer>
      </Container>
    </>
  );
}

export default Dashboard;
