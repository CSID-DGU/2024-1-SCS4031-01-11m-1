import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
    display: inline-flex;
    padding-right: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 26px;
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

const MinuteSum = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 2;
    white-space: pre-line; 
    position: relative; 
    display: flex;
    flex-direction: column;
    width: 330px;
    height: 300px;
    align-items: flex-start;
    margin-left: 70px;
 
`;


function MinuteDetail() {
  return (
    <Container>
        <SubTitle>Minutes</SubTitle>
        <MinuteSum>
            보습 효과를 높이기 위한 새로운 기술과 재료에 대한 토론이 이루어졌습니다.<br />
            제품 개선을 위한 보습력 측정 방법에 대한 의견을 공유했습니다.<br />
            경쟁사의 제품과 비교하여 우리 제품의 보습력을 분석했습니다.<br />
            고객들이 원하는 보습 효과와 우리 제품의 차별성을 논의했습니다.<br />
            보습력 향상을 위한 추가적인 연구 및 테스트 계획을 작성했습니다.<br />
        </MinuteSum>
    </Container>
    
  )
}

export default MinuteDetail;