import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../pages/Navbar';
import styled from 'styled-components';
import nexticon from '../image/nexticon.png';
import CategoryCard from './reportdetail/CategoryCard';
import CategoryDetail from './reportdetail/CategoryDetail';
import { useParams } from 'react-router-dom';

const Report = styled.div`
  color: #727272;
  font-family: "Wanted Sans";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-left: 30px;
  margin-top: 20px;
`;

const Title = styled.div`
  color: #333;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 13px;
  margin-left: 30px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;  
  justify-content:center;
  width: 100%; 
  height: 100%; 
  margin-top:20px;
`;

const LeftContainer = styled.div`
  width:680px; 
  height: 900px; 
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  background: #fff;
`;

const RightContainer = styled.div`
  width: 680px; 
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
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-top: 25px;
  margin-left: 25px;
`;

const ReportDetail = () => {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState({
    productName: "",
    reportSources: []
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken = userInfo?.accessToken;
  
    if (accessToken) {
      axios.get(`http://15.165.14.203/api/member-data/report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          console.log(response.data);
          const { productName, reportSources } = response.data;
          const categorizedData = {};
  
          reportSources.forEach(category => {
            const { categoryName, keywords, vocSummaries, answer } = category;
            categorizedData[categoryName] = { keywords, vocSummaries, answer };
          });
  
          setReportData({
            productName,
            categorizedData
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      console.error('No access token, or report ID found'); 
    }
  }, [reportId]);
  
  const handleCardClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Navbar />
      <Report>Report</Report>
      <Title>{reportData.productName}</Title>
      <Container>
        <LeftContainer>
          <SubTitle>VOC - Minute Analysis</SubTitle>
          <CategoryCard cards={reportData.reportSources} onCardClick={handleCardClick} />
        </LeftContainer>
        <RightIcon src={nexticon} />
        <RightContainer>
          {selectedCategory && (
            <CategoryDetail
              categoryName={selectedCategory.categoryName}
              keywords={selectedCategory.keywords}
              vocSummaries={selectedCategory.vocSummaries}
              answer={selectedCategory.answer}
            />
          )}
        </RightContainer>
      </Container>
    </>
  );
};

export default ReportDetail;
