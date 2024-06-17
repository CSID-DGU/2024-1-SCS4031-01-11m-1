import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  height: 83vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F5F7FA;
`;

const StyledTable = styled.div`
  width: 90%;
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
`;

const CategoryVocTable= () => {

  const rows = Array(8).fill(Array(8).fill(""));

  return (
    <TableContainer>
      <StyledTable>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}></TableCell>
            ))}
          </TableRow>
        ))}
      </StyledTable>
    </TableContainer>
  );
};

export default CategoryVocTable;
