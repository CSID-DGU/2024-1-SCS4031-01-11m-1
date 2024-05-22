import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Report from './Report';
import axios from "axios"
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

function ReportTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const reportPerPage = 13;

  
    const reports = [Report,Report];

    const totalPages = Math.ceil(reports.length / reportPerPage);
    const indexOfLastReport = currentPage * reportPerPage;
    const indexOfFirstReport = indexOfLastReport - reportPerPage;
    const currentReport = reports.slice(indexOfFirstReport, indexOfLastReport);

    const [reportList, setReportList] = useState([]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //게시물 가져오기 
    useEffect(() => {
        const getReportList = async () => {
            const {data} = await axios.get();
            return data;
        }
    })

    return (
        <>
            <TableContainer>
                <Table>
                <tbody>
                    <TableRow>
                        <TableCell width="5%">ID</TableCell>
                        <TableCell width="35%">Title</TableCell>
                        <TableCell width="30%">Product</TableCell>
                        <TableCell width="20%">Date</TableCell>
                        <TableCell width="20%">Importance</TableCell>    
                    </TableRow>
                    {/* {currentReport.map((report, index) => (
                    < key={index} {...reports} />
                    ))} */}
                </tbody>
                <Report />
                <div>
                    {reportList.map((item, index) => (
                        <Report key={item.id} id={item.id} title={item.title} date={moment(item.created).add(9,"hour").format('YYYY-MM-DD')}
                            product={item.product} importance={item.importance} 
                        />
                    ))}
                </div>
                
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
