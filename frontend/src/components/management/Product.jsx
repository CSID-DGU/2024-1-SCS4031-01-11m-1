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
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 10px;
`;

const Image = styled.img`
    max-width: 100%;
    max-height: 80%;
    border-radius: 5px;
`;

const ImageContainer = styled.div`
    width: 85px;
    height: 85px;
    background-size: cover;
    flex-shrink: 0;
    border-radius: 5px;
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
    position: relative;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    display: ${({ visible }) => (visible ? 'block' : 'none')};
    top: 0;
    right: calc(100%);
    width: 58px;
    height: 65px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 0.5px solid #B4B4B4;
    background: #FFF;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.25);
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
    text-align: center;
`;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 2px;
`;

const ProductName = styled.p`
    flex-shrink: 0;
    color: #333;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const ProductExplanation = styled.p`
    flex-shrink: 0;
    color: #333;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 1px;
    text-align: left;
`;

const Product = ({ id, name, explanation, url }) => {
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

    return (
        <TableRow>
            <TableCell>{id}</TableCell>
            <TableCell>
                <ImageContainer>
                    <Image src={url} alt="Product Image" />
                </ImageContainer>
            </TableCell>
            <TableCell>
                <ProductContainer>
                    <ProductName>{name}</ProductName>
                    <ProductExplanation>{explanation}</ProductExplanation>
                </ProductContainer>
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
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export default Product;
