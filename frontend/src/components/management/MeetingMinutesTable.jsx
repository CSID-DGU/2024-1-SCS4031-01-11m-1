import React, { useState } from 'react';
import styled from 'styled-components';
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

  
    const minutes = [Minute,Minute];

    const totalPages = Math.ceil(minutes.length / minutesPerPage);
    const indexOfLastMinute = currentPage * minutesPerPage;
    const indexOfFirstMinute = indexOfLastMinute - minutesPerPage;
    const currentMinutes = minutes.slice(indexOfFirstMinute, indexOfLastMinute);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <TableContainer>
                <Table>
                <tbody>
                    <TableRow>
                        <TableCell width="10%">ID</TableCell>
                        <TableCell width="60%">Title</TableCell>
                        <TableCell width="30%">File</TableCell>     
                    </TableRow>
                    {currentMinutes.map((mintue, index) => (
                    <Minute key={index} {...minutes} />
                    ))}
                </tbody>
                <Minute />
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

export default MeetingMinutesTable;
