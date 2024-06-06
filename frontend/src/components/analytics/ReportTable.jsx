import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import trashicon from '../image/trashicon.png';

const TableContainer = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 20px;
`;

const Table = styled.table`
    width: 96%;
    border-collapse: collapse;
    margin: auto;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #ccc;
    height: 30px;
`;

const TableHeaderCell = styled.td`
    color: #878787;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    width: ${props => props.width || 'auto'}; 
`;

const TableCell = styled.td`
    color: #333;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    vertical-align: middle;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: fixed;
  bottom: 20px; 
  width: 100%;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 14px;
    font-family: "Wanted Sans";
    cursor: pointer;
    border: none;
    background-color: ${({ active }) => active ? 'transparent' : 'transparent'};
    color: ${({ active }) => active ? '#1C3159' : '#D9D9D9'};
  border-radius: 5px;
`;

function ReportTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const reportPerPage = 15;
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();

    const getReportList = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const accessToken = userInfo ? userInfo.accessToken : null;
            const memberId = userInfo ? userInfo.memberId : null;

            if (!accessToken || !memberId) {
                console.error('Access token or member ID not found');
                return;
            }

            const response = await axios.get(`http://15.165.14.203/api/member-data/reports/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            

            // 역순으로 정렬하여 최신 글부터 보이도록 함
            const sortedReports = response.data.reverse();
            setReportList(sortedReports);
            console.log('Report List:', sortedReports);
            
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        getReportList();
        
    }, []); 

    const indexOfLastReport = currentPage * reportPerPage;
    const indexOfFirstReport = indexOfLastReport - reportPerPage;
    const currentReport = reportList.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(reportList.length / reportPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleReportClick = (reportId) => {
        navigate(`${reportId}`);
    };

    

    return (
        <>
            <TableContainer>
                <Table>
                    <tbody>
                        <TableRow>
                            <TableHeaderCell width="30%">Product</TableHeaderCell>
                            <TableHeaderCell width="20%">Date</TableHeaderCell>
                            {/* <TableCell width="20%">Importance</TableCell> */}
                            <TableHeaderCell width="5%"></TableHeaderCell>
                        </TableRow>
                        {currentReport.map((report) => (
                            <TableRow key={report.id} onClick={() => handleReportClick(report.id)}>
                                <TableCell>{report.productName}</TableCell>
                                <TableCell>{report.createdAt.split('T')[0]}</TableCell>
                                {/* <TableCell>{report.importance}</TableCell> */}
                                
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
            <PaginationContainer>
                {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationButton
                        key={index}
                        active={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </PaginationButton>
                ))}
            </PaginationContainer>
        </>
    );
}

export default ReportTable;