import React from 'react';
import styled from 'styled-components';
import Product from './Product';

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



function ProductTable() {
  return (
    <TableContainer>
      <Table>
        <tbody>
          <TableRow>
            <TableCell width="5%">ID</TableCell>
            <TableCell width="10%">Image</TableCell>
            <TableCell width="45%">Product</TableCell>
            <TableCell width="25%">URL</TableCell>
            <TableCell width="5%"></TableCell>
          </TableRow>
        </tbody>
        <Product />
        <Product />
      </Table>
    </TableContainer>
  );
}

export default ProductTable;
