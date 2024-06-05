import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import morebutton_icon from '../image/morebutton_icon.png';
import AddProduct from './AddProduct';

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

const MoreButton = styled.button`
    position: relative;
    width: 20px;
    height: 20px;
    background: url(${morebutton_icon}) no-repeat center;
    background-size: contain;
    border: none;
    cursor: pointer;
`;

const OptionsContainer = styled.div`
    position: absolute;
    top: 40%;
    left: 92%;
    z-index: 99;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

const OptionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    width: 100%;
    padding: 5px;
    text-align: left;
    color: #000;
    font-family: "Wanted Sans";
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const Category = ({ categoryName }) => {
    
    
    return (
        <TableRow>
            <TableCell>
                {categoryName}
            </TableCell>
        </TableRow>
    );
};


Category.propTypes = {
    categoryName: PropTypes.string.isRequired,
}

export default Category;
