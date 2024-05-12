import React from 'react';
import { useNavigate } from 'react-router-dom';
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


const Report = ({report_id, title, product, date, importance}) => {
    const navigate = useNavigate();
    return (
        <TableRow onClick={()=> {
            navigate(`/report/${report_id}`)
        }}>
            <TableCell>
                {report_id}
            </TableCell>
            <TableCell>
                {title}
            </TableCell>
            <TableCell>
                {product}
            </TableCell>
            <TableCell>
                {date}
            </TableCell>
            <TableCell>
                {importance}
            </TableCell>
        </TableRow>
    );
};

export default Report;
