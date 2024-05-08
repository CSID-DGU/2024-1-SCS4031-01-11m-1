import React from 'react';
import styled from 'styled-components';

const TableRow = styled.tr`
    border-bottom: 1px solid #ccc;
`;

const TableCell = styled.td`
    color: #333;
    text-align: left;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 10px;
`;



const Product = () => {
    
    return (
        <TableRow>
            <TableCell>1</TableCell>
            <TableCell>
                카테고리~
            </TableCell>
            
        </TableRow>
    );
};

export default Product;
