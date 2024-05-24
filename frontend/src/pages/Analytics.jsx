import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from "./Navbar";
import plusicon from '../components/image/plus_icon.png';
import ReportTable from '../components/analytics/ReportTable';
import AddReport from '../components/analytics/AddReport';

const Container = styled.div`
    width: 100%;
    height: 83vh;
    background-color: #F5F7FA;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    align-items: center; 
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 27px;
    margin-left: 57px;
`;

const ListContainer = styled.div`
    width: 95%;
    height: 100%; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
`;

const AddRebortbtn = styled.button`
    display: flex;
    width: 116px;
    height: 31px;
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #1C3159;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.25);
    color: #DFDFDF;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    position:relative;
    left:88%;
    top:-7%;
`;

const Addicon = styled.div`
    background: url(${plusicon});
    background-repeat: no-repeat;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
`;

function Analytics() {
    const [showAddReport, setShowAddReport] = useState(false);

    const handleAddReportClick = () => {
        setShowAddReport(true);
    };

    const handleCloseAddReport = () => {
        setShowAddReport(false);
    };

    return (
        <>
            <Navbar />
            <Title>Analytics</Title>
            <Container>
                <ListContainer>
                    <AddRebortbtn onClick={handleAddReportClick}>
                        <Addicon />
                        Add Report
                    </AddRebortbtn>
                    {showAddReport ? <AddReport onClose={handleCloseAddReport} /> : <ReportTable />}
                </ListContainer>
            </Container>
        </>
    );
}

export default Analytics;
