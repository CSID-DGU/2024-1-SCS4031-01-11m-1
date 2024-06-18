import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../pages/Navbar';
import styled from 'styled-components';
import nexticon from '../image/nexticon.png';
import CategoryCard from './reportdetail/CategoryCard';
import CategoryDetail from './reportdetail/CategoryDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 13px;
  margin-left: 30px;
`;

const Title = styled.div`
  color: #333;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width:500px;
`;

const DeleteButton = styled.button`
  padding: 7px 10px;
  background-color: #a4a4a4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Wanted Sans';
  font-size: 12px;
  font-weight: 600;
  margin-left: 870px;

  &:hover {
    background-color: #878787;
  }
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
  height: 800px; 
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  background: #fff;
`;

const RightContainer = styled.div`
  width: 680px; 
  height: 800px; 
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
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    productName: "",
    reportSources: [],
    vocCounts: []
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

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
        const { productName, reportSources, vocCount } = response.data;
        setReportData({
          productName,
          reportSources,
          vocCount 
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    } else {
      console.error('No access token, or report ID found'); 
    }
  }, [reportId]);

  const handleCardSelect = (reportSource) => {
    setSelectedCard(reportSource);
    console.log(reportSource);
  };

  const handleDelete = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken = userInfo?.accessToken;

    if (accessToken) {
      try {
        console.log(reportId);
        await axios.delete(`http://15.165.14.203/api/member-data/delete-report/${reportId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        alert('Report deleted successfully');
        navigate('/analytics'); 
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    } else {
      console.error('No access token found');
      alert('No access token found');
    }
  };

  return (
    <>
      <Navbar />
      <Report>Report</Report>
      <TitleContainer>
        <Title>{reportData.productName}</Title>
        <DeleteButton onClick={handleDelete}>Delete Report</DeleteButton>
      </TitleContainer>
      <Container>
        <LeftContainer>
          <SubTitle>VOC - Minute Analysis</SubTitle>
          <CategoryCard 
            reportSources={reportData.reportSources} 
            vocCount={reportData.vocCount} 
            onSelectCard={handleCardSelect} 
          />
        </LeftContainer>
        <RightIcon src={nexticon} />
        <motion.div 
          className="box"
          animate={{ x: 10 }}
          transition={{ type: "spring" }}>
          <RightContainer>
            {selectedCard && (
              <CategoryDetail reportSource={selectedCard}/>
            )}
          </RightContainer>
        </motion.div>
      </Container>
    </>
  );
};

export default ReportDetail;
