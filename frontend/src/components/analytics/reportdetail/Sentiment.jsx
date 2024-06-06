import React from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
`;



const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    width:240px;
    height:240px;
    margin-top:20px;
`;

const TotalContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    position: absolute;
    margin-bottom: 20px;
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

const Sentiment = ({ negativeCnt, positiveCnt }) => {
  
    console.log(negativeCnt, positiveCnt);
    const data = {
        labels: ['Negative', 'Positive'],
        datasets: [
            {
                label: 'sentiment',
                data: [negativeCnt, positiveCnt],
                backgroundColor: ['#1C3159', '#505F7B'],
                hoverBackgroundColor: ['#1C3159', '#505F7B'],
                borderWidth: 1,
            },
        ],
    };

   
    const total =negativeCnt + positiveCnt;

    const options = {
        cutout: '50%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 20,
                    font: {
                        family: 'Wanted Sans',
                        size: 12,
                        color: '#333',
                        weight: 400,
                    },
                },
            },
        },
    };

    return (
        <Container>
            <ChartContainer>
                <Doughnut data={data} options={options} />
            </ChartContainer>
            <TotalContainer>
                <Total>Total</Total>
                <TotalNum>{total}</TotalNum>
            </TotalContainer>
        </Container>
    );
};

// props의 타입을 검사하는 PropTypes 설정
Sentiment.propTypes = {
    reportSource: PropTypes.shape({
        negativeCnt: PropTypes.number.isRequired,
        positiveCnt: PropTypes.number.isRequired,
    }),
};

export default Sentiment;
