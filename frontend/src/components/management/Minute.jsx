import React from 'react';
import styled from 'styled-components';
import pdf from '../file/지상의 모든 심리(24-1 강의계획서).pdf';

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

const FileName = styled.span`
    cursor: pointer;
    text-decoration: underline;
`;

const Product = () => {
    const downloadPdf = () => {
        const link = document.createElement('a');
        link.href = pdf;
        link.download = '지상의 모든 심리(24-1 강의계획서).pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <TableRow>
            <TableCell>1</TableCell>
            <TableCell>
                회의록회의록
            </TableCell>
            <TableCell>
                <FileName onClick={downloadPdf}>지상의 모든 심리(24-1 강의계획서).pdf</FileName>
            </TableCell>
        </TableRow>
    );
};

export default Product;
