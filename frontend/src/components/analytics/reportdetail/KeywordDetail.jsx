import React from 'react'
import styled from 'styled-components';


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

const KeywordsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

const KeywordContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 330px;
    height: 300px;
    justify-content: top;
    align-items: flex-start;
    flex-shrink: 0;
    margin-left: 50px;
    margin-top: 25px;
`;

const Keyword = styled.div`
    color: #1c3159;
    font-family: 'Wanted Sans';
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    display: flex;
    padding: 6px 11px;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    background: #bbc1cd;
`;

const ReviewSum = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 2;
    white-space: pre-line; 
    margin-left: 5px; 
    text-indent: -20px; 
    position: relative; 
`;

const BulletPoint = styled.span`
    position: absolute;
    left: 0;
    top: 0;
    content: '•'; 
    margin-right: 5px; 
`;



function KeywordDetail() {
  return (
    <>
        <SubTitle>Keyword</SubTitle>
            <KeywordsWrapper>
                <KeywordContainer>
                    <Keyword>키워드1</Keyword>
                    <ReviewSum>
                        <br />  
                        <BulletPoint />피부를 촉촉하게 유지하여 만족스럽다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                        <br />
                        <BulletPoint />피부를 촉촉하게 유지하여 만족스럽다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                    </ReviewSum>
                </KeywordContainer>
                <KeywordContainer>
                    <Keyword>키워드1</Keyword>
                    <ReviewSum>
                        <br />  
                        <BulletPoint />피부를 촉촉하게 유지하여 만족스럽다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                        <br />
                        <BulletPoint />피부를 촉촉하게 유지하여 만족스럽다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                        <br />
                        <BulletPoint />보습력이 대단하여 건조한 겨울철에도 사용 가능하다.
                    </ReviewSum>
                </KeywordContainer>
            </KeywordsWrapper>
            
    
    </>
  )
}

export default KeywordDetail;