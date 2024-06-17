import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components'; // Import styled from styled-components

// ChartJS 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: 10px; 

`;


const VocChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken = userInfo ? userInfo.accessToken : null;
    const memberId = userInfo ? userInfo.memberId : null;

    axios.get(`http://15.165.14.203/api/voc/count/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        const datasets = response.data.map((memberData, index) => {
          const categoryName = memberData.categoryName;
          let vocCountList = memberData.vocCountList;

          // 최근 10개만
          vocCountList = vocCountList.slice(0, 10).reverse(); 
          const labels = vocCountList.map((vocItem) => {
            const slicedDate = vocItem.date.slice(0, 12); // YYYY-MM-DD 형식의 날짜 문자열 가져오기
            const startDate = new Date(slicedDate); 
            const endDate = new Date(startDate); 
            endDate.setDate(endDate.getDate() + 6); // 7일 더하기
          
            const formattedStartDate = startDate.toISOString().slice(5, 10); 
            const formattedEndDate = endDate.toISOString().slice(5, 10); 
            const dateResult = `${formattedStartDate} ~ ${formattedEndDate}`; 
            
            return dateResult;
          });
          console.log(labels);
          const totalData = vocCountList.map(vocItem => vocItem.total); 
          
          if (index === 0) {
            setChartData(prevState => ({
              ...prevState,
              labels
            }));
          }

          const colors = ['#1C3159', '#77839B', '#7E95C1', '#A8B0BF', '#4A5C7D', '#304875'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Randomly choose a color from the array

          return {
            label: `${categoryName}`,
            data: totalData,
            borderColor: randomColor, 
            borderWidth: 3, 
            tension: 0.1,
          };
        });

        setChartData(prevState => ({
          ...prevState,
          datasets
        }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          color: '#000',
          font: {
            family: 'Pretendard', 
          },
        },
      },
    },
    scales: {
      x: {
        font:{
          family:'Pretendard',
          size:1,
        }, 
      },
      y: {
        font:{
          family:'Pretendard',
          size:1,
        }, 
      },
    },
  };

  return (
    <ChartContainer>

      <Line data={{ labels: chartData.labels, datasets: chartData.datasets }} options={options} />
    </ChartContainer>
  );
};

export default VocChart;