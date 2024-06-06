import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import Product from './addreport/Product'; // Ensure this path is correct
import Data from './addreport/Data'; // Ensure this path is correct
import Document from './addreport/Document'; // Ensure this path is correct
import DateRange from './addreport/DateRange'; // Ensure this path is correct

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
    position: relative;
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

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    z-index: 2000;
`;

function AddReport({ onClose }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(false); 
    const isMounted = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.memberId && userInfo.accessToken) {
            setMemberId(userInfo.memberId);
            setAccessToken(userInfo.accessToken);
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleCancel = () => {
        onClose();
    };

    const handleSave = async () => {
        if (!selectedProduct || !selectedDocument || !startDate || !endDate) {
            alert("Please select a product, a document, and date range.");
            return;
        }

        setLoading(true); 

        try {
            const requestBody = {
                productId: selectedProduct.id,
                minuteId: selectedDocument.id,
                startDate: startDate.toISOString().replace('T', ' ').substring(0, 19),
                endDate: endDate.toISOString().replace('T', ' ').substring(0, 19)
            };

            const response = await axios.post(
                `http://15.165.14.203/api/member-data/report/${memberId}`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (response.status === 201) {
                // alert("Report saved successfully!");
                navigate(`${response.data}`); 
                onClose();
            }
        } catch (error) {
            if (isMounted.current) {
                console.error("Failed to save report", error);
                alert("Failed to save report");
            }
        } finally {
            if (isMounted.current) {
                setLoading(false); 
            }
        }
    };

    const handleDateRangeSelect = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <ModalOverlay>
            <Container>
                <Title>Add Report</Title>
                <Content>
                    <Column>
                        <Product onProductSelect={setSelectedProduct} />
                        <Data />
                    </Column>
                    <Column>
                        <Document onDocumentSelect={setSelectedDocument} />
                        <DateRange onDateRangeSelect={handleDateRangeSelect} />
                    </Column>
                </Content>
                <Line />
                <ButtonContainer>
                    <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                    <SaveButton onClick={handleSave}>Save</SaveButton>
                </ButtonContainer>
                {loading && (
                    <SpinnerContainer>
                        <TailSpin height={80} width={80} color="#1C3159" ariaLabel="loading" />
                    </SpinnerContainer>
                )}
            </Container>
        </ModalOverlay>
    );
}

export default AddReport;
