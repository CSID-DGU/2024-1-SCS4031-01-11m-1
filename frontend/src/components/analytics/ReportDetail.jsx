import React from 'react';
import Navbar from '../../pages/Navbar';
import styled from 'styled-components';
import nexticon from '../image/nexticon.png';
import CategoryCard from './reportdetail/CategoryCard';

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
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 13px;
  margin-left: 57px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;  
  width: 100vw;
  height: 90vh; 
  margin-top: 33px;
  margin-left: 57px;
  box-sizing: border-box; 
`;

const LeftContainer = styled.div`
  width: 800px;  
  height: 900px; 
  flex-shrink: 0;
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
  margin-left: 1.5%;
`;

const RightIcon = styled.img`
  width: 60px;
  height: 50px;
  flex-shrink: 0;
  margin-left: 16px;
`;

const SubTitle = styled.div`
  color: #333;
  font-family: 'Wanted Sans';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 23px;
  margin-left: 30px;
`;

function ReportDetail() {
  return (
    <>
      <Navbar />
      <Report>Report</Report>
      <Title>레포트제목</Title>
      <Container>
        <LeftContainer>
          <SubTitle>VOC - Minute Analysis</SubTitle>
          <CategoryCard />
        </LeftContainer>
        <RightIcon src={nexticon} />
        <RightContainer></RightContainer>
      </Container>
    </>
  );
}

export default ReportDetail;
