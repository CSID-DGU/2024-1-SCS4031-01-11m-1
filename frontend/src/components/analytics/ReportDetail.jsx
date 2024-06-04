import React from 'react';
import Navbar from '../../pages/Navbar';
import styled from 'styled-components';
import nexticon from '../image/nexticon.png';
import CategoryCard from './reportdetail/CategoryCard';
import CategoryDetail from './reportdetail/CategoryDetail';

const Report = styled.div`
  color: #727272;
  font-family: "Wanted Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-left: 57px;
  margin-top: 34px;
`;

const Title = styled.div`
  color: #333;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 13px;
  margin-left: 57px;
  
`;

const Container = styled.div`
  display: flex;
  align-items: center;  
  justify-content:center;
  width: 1920px; 
  height: 970px; 
  margin-left: auto;
  margin-right: auto;
`;

const LeftContainer = styled.div`
  width: 800px; 
  height: 900px; 
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  background: #fff;
  
`;

const RightContainer = styled.div`
  width: 800px; 
  height: 900px; 
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  background: #fff;
  margin-left: 23px;
`;

const RightIcon = styled.img`
  width: 60px;
  height: 50px;
  flex-shrink: 0;
  margin-left: 23px;

`;

const SubTitle = styled.div`
  color: #333;
  font-family: 'Wanted Sans';
  font-size: 25px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 30px;
  margin-left: 45px;
`;

function ReportDetail() {
  return (
    <>
      <Navbar />
      <Report>Report</Report>
      <Title>제품명!</Title>
      <Container>
        <LeftContainer>
          <SubTitle>VOC - Minute Analysis</SubTitle>
          <CategoryCard />
        </LeftContainer>
        <RightIcon src={nexticon} />
        <RightContainer>
          <CategoryDetail />
        </RightContainer>
      </Container>
    </>
  );
}

export default ReportDetail;
