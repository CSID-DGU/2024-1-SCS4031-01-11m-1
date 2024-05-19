import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import morebutton_icon from '../image/morebutton_icon.png';

const TableRow = styled.tr`
    border-bottom: 1px solid #ccc;

`;

const TableCell = styled.td`
    color: #333;
    text-align: left;
    padding: 10px;
    
`;

const ProductImage = styled.img`
    width: 85px;
    height: 85px;
    border-radius: 5px;  
    vertical-align: top ;
`;

const ProductContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ProductDetails = styled.div`
    width:100%;
    display:flex;
    flex-direction: column;
    justify-items: center;
    

`;

const ProductproductName = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    color:#333;
    
`;

const ProductExplanation = styled.p`
    margin: 0;
    font-size: 12px;
    color:#333;
`;

const MoreButton = styled.button`
    width: 20px;
    height: 20px;
    background: url(${morebutton_icon}) no-repeat center;
    background-size: contain;
    border: none;
    cursor: pointer;
`;

const OptionsContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 5px;
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
`;

const Product = ({ id, productName, description, url, productImage }) => {
    const [optionsVisible, setOptionsVisible] = useState(false);

    const handleMoreButtonClick = () => {
        setOptionsVisible(!optionsVisible);
    };

    const handleEditClick = () => {
        console.log('Edit button clicked');
        // 수정로직 여기에
    };

    const handleDeleteClick = () => {
        console.log('Delete button clicked');
        // 삭제로직 여기에
    };

    const handleOptionClick = () => {
        setOptionsVisible(false); // 옵션 메뉴 닫기
    };


    return (
        <TableRow>
            {/* <TableCell>{id}</TableCell> */}
            <TableCell> 
                <ProductImage src={productImage} alt="Product productImage" />
            </TableCell>
            <TableCell>
                    <ProductDetails>
                        <ProductproductName>{productName}</ProductproductName>
                        <ProductExplanation>{description}</ProductExplanation>
                    </ProductDetails>
            </TableCell>
            <TableCell>
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            </TableCell>
            <TableCell>
                <MoreButton onClick={handleMoreButtonClick} />
                <OptionsContainer visible={optionsVisible}>
                    <OptionButton onClick={handleEditClick}>Edit</OptionButton>
                    <OptionButton onClick={handleDeleteClick}>Delete</OptionButton>
                </OptionsContainer>
            </TableCell>
        </TableRow>
    );
};

Product.propTypes = {
    id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productImage : PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export default Product;
