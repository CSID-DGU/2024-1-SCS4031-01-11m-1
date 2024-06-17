import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TableContainer = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    margin-left: 40px;
    margin-top: 20px;
    margin-bottom: 30px;
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
    color: #000;
    font-family: Pretendard;
    font-size: 12px;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? '#E0E0E0' : '#FFF')};
    
`;

const TableCell = styled.div`
    flex: 1;
    padding: 12px;
    &:last-child {
        border-right: none;
    }
    font-weight: ${(props) => (props.header ? 'bold' : 'normal')};
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
`;

const CategoryVocTable = ({ onSelectCategory }) => {
    const [tableData, setTableData] = useState([]);
    const [headerDates, setHeaderDates] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); 

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
                   
                    if (response.data.length > 0) {
                        const dates = response.data[0].vocCountList.map((item) => item.date.slice(0, 10));
                        setHeaderDates(dates.slice(0, 10).reverse()); 
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);

    const formatHeaderDate = (dateString) => {
        const startDate = new Date(dateString);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        const formattedStartDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
        const formattedEndDate = `${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
        return `${formattedStartDate} ~ ${formattedEndDate}`;
    };

    const handleRowClick = (categoryId) => {
        setSelectedCategoryId(categoryId); 
        onSelectCategory(categoryId);
    };

    return (
        <TableContainer>
            <StyledTable>
                <TableRow>
                    <TableCell header>Category</TableCell>
                    {headerDates.map((date, index) => (
                        <TableCell key={index} header>
                            {formatHeaderDate(date)}
                        </TableCell>
                    ))}
                </TableRow>
                
                {tableData.map((row, rowIndex) => (
                    <TableRow
                        key={rowIndex}
                        onClick={() => handleRowClick(row.categoryId)}
                        selected={selectedCategoryId === row.categoryId} 
                    >
                        <TableCell header>{row.categoryName}</TableCell>
                        {headerDates.map((headerDate, headerIndex) => {
                            const vocItem = row.vocCountList.find((item) => item.date.slice(0, 10) === headerDate.slice(0, 10));
                            return (
                                <TableCell key={headerIndex}>
                                    {vocItem ? vocItem.total : '-'}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </StyledTable>
        </TableContainer>
    );
};

export default CategoryVocTable;
