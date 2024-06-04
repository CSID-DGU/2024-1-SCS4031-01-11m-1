import React from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);
const Container = styled.div`
    display: inline-flex;
    padding-right: 5px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left:50px;

`;
const SubTitle = styled.div`
    color: #333;
    height:30px;
    font-family: 'Wanted Sans';
    font-size: 25px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 30px;
`;

const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    /* height:280px;
    width:290px; */
`;

const TotalContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 6px;
    position:absolute;
    margin-top:120px;
    margin-left:77px;
`;

const Total = styled.p`
    color: #333;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const TotalNum = styled.p`
    color: #333;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;


const Sentiment = () => {
  const data = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: '# of Votes',
        data: [300, 200],
        backgroundColor: ['#505F7B', '#1C3159'],
        hoverBackgroundColor: ['#505F7B', '#1C3159'],
        borderWidth: 1,
      },
    ],
  };

  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

  const options = {
    cutout: '50%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding:20,
          font: {
            family: 'Wanted Sans', 
            size: 12,
            color:'#333',
            weight:400,
          },
        },
        
      },
    },
  };

  return (    
        <Container>
            <SubTitle>Sentiment</SubTitle>
            <ChartContainer>
                <Doughnut data={data} options={options} />
                <TotalContainer>
                    <Total>total</Total>
                    <TotalNum>{total}</TotalNum>
                </TotalContainer>
            </ChartContainer>
        </Container>
  );
};

export default Sentiment;
