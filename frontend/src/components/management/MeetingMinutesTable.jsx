import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Minute from './Minute';

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

const TableCell = styled.td`
    color: #878787;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    width: ${props => props.width || 'auto'}; 
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: fixed;
  bottom: 20px; 
  width: 100%;
  z-index: 1000; 
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: "Wanted Sans";
  cursor: pointer;
  border: none;
  background-color:${({ active }) => active ? 'transparent' : 'transparent'};
  color: ${({ active }) => active ? '#1C3159' : ' #D9D9D9'};
  border-radius: 5px;
`;

function MeetingMinutesTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const minutesPerPage = 13;
    const [minutes, setMinutes] = useState([]);

    const serverUrl = 'http://15.165.14.203/api/'; // 서버 URL을 변수로 설정

    const totalPages = Math.ceil(minutes.length / minutesPerPage);
    const indexOfLastMinute = currentPage * minutesPerPage;
    const indexOfFirstMinute = indexOfLastMinute - minutesPerPage;
    const currentMinutes = minutes.slice(indexOfFirstMinute, indexOfLastMinute);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const accessToken = userInfo ? userInfo.accessToken : null;
                const memberId = userInfo ? userInfo.memberId : null;

                if (!accessToken || !memberId) {
                    console.error('Access token or member ID not found');
                    return;
                }
               
                const response = await axios.get(`${serverUrl}member-data/product-minutes/${memberId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const minute = response.data;
                console.log(minute.minute)

                const minutesWithServerUrl = response.data.map(minute => ({
                    ...minute,
                    fileUrl: `${serverUrl}${minute.minute}`
                }));

                setMinutes(minutesWithServerUrl);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteMinute = (minuteId) => {
        setMinutes(minutes.filter(minute => minute.id !== minuteId));
    };

    const handleEditMinute = (minuteId, updatedMinute) => {
        const updatedMinuteWithServerUrl = {
            ...updatedMinute,
            fileUrl: `${serverUrl}${updatedMinute.fileUrl}`
        };
        setMinutes(minutes.map(minute => minute.id === minuteId ? updatedMinuteWithServerUrl : minute));
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <thead>
                        <TableRow>
                            <TableCell width="60%">Title</TableCell>
                            <TableCell width="30%">File</TableCell>
                            <TableCell width="5%"></TableCell>     
                        </TableRow>
                    </thead>
                    <tbody>
                        {currentMinutes.map((minute) => (
                            <Minute 
                                key={minute.id} 
                                {...minute}
                                onDelete={handleDeleteMinute}
                                onEdit={handleEditMinute} />
                        ))}
                    </tbody>
                </Table>
            </TableContainer>

            {/* 페이지네이션 */}
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

export default MeetingMinutesTable;
