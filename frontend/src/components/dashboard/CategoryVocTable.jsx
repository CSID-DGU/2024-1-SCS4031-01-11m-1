import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TableContainer = styled.div`
  width: 100%;
  height: 342px;
  display: flex;
  margin-left: 40px;
  margin-top: 40px;
`;

const StyledTable = styled.div`
  width: 92%;
  border-collapse: collapse;
`;

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid #DFDFDF;
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 16px;
  border-right: 1px solid #DFDFDF;
  &:last-child {
    border-right: none;
  }
  font-weight: ${(props) => (props.header ? 'bold' : 'normal')};
`;

const CategoryVocTable = () => {
  const [tableData, setTableData] = useState([]);
  const [headerDates, setHeaderDates] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken = userInfo ? userInfo.accessToken : null;
    const memberId = userInfo ? userInfo.memberId : null;

    if (accessToken && memberId) {
      axios
        .get(`http://15.165.14.203/api/voc/count/member/${memberId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setTableData(response.data);

          // Assuming the first category has the complete date range
          if (response.data.length > 0) {
            const dates = response.data[0].vocCountList.map((item) => item.date.slice(0, 10));
            setHeaderDates(dates.slice(0, 10));
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  return (
    <TableContainer>
      <StyledTable>
        <TableRow>
          <TableCell header>Category</TableCell>
          {headerDates.map((date, index) => (
            <TableCell key={index} header>
              {date}
            </TableCell>
          ))}
        </TableRow>
        {tableData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>{row.categoryName}</TableCell>
            {row.vocCountList.slice(0, 10).map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell.total}</TableCell>
            ))}
          </TableRow>
        ))}
      </StyledTable>
    </TableContainer>
  );
};

export default CategoryVocTable;
