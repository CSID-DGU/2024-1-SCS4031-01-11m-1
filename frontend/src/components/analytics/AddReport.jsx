import React from 'react';
import styled from 'styled-components';
import Product from './addreport/Product';
import Data from './addreport/Data';
import Document from './addreport/Document';
import DateRange from './addreport/DateRange';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 1000; 
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    width: 695px;
    height: 494px;
    border-radius: 10px;
    background: #FFF;
    padding: 26px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const Line = styled.div`
    position:relative;
    z-index:99;
    width: 100%;
    height: 1px;
    background: #D9D9D9;
    margin-top: 13px;
`;

const Content = styled.div`
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 48%;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 20px;
`;

const SaveButton = styled.button`
    display: flex;
    width: 79px;
    height: 27px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #1C3159;
    color: #FFF;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
`;

const CancelButton = styled.button`
    display: flex;
    width: 79px;
    height: 27px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid #D9D9D9;
    color: #B4B4B4;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
`;

function AddReport({ onClose }) {
    const handleCancel = () => {
        // 취소 버튼 클릭 시 onClose 호출
        onClose();
    };

    const handleSave = () => {
        // 저장 버튼 클릭 시 처리 로직 작성
    };

    return (
        <ModalOverlay>
            <Container>
                <Title>Add Report</Title>
                <Content>
                    <Column>
                        <Product />
                        <Data />
                    </Column>
                    <Column>
                        <Document />
                        <DateRange />
                    </Column>
                </Content>
                <Line />
                <ButtonContainer>
                    <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                    <SaveButton onClick={handleSave}>Save</SaveButton>
                </ButtonContainer>
            </Container>
        </ModalOverlay>
    );
}

export default AddReport;
