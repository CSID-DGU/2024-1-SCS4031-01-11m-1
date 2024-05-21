import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import morebutton_icon from '../image/morebutton_icon.png';
import AddProduct from './AddProduct';

const TableRow = styled.tr`
    border-bottom: 1px solid #ccc;
    position: relative;
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
    vertical-align: top;
`;

const ProductDetails = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
`;

const ProductName = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    color: #333;
`;

const ProductExplanation = styled.p`
    margin: 0;
    font-size: 12px;
    color: #333;
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
    top: 50%;
    left: 90%;
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
    &:hover {
        background-color: #f0f0f0;
    }
`;

const Product = ({ id, productName, productImage, description, url, onDelete, onEdit }) => {
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleMoreButtonClick = () => {
        setOptionsVisible(!optionsVisible);
    };

    const handleEditClick = () => {
        setOptionsVisible(false);
        setIsEditing(true);
    };

    const handleDeleteClick = async () => {
        setOptionsVisible(false);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const accessToken = userInfo ? userInfo.accessToken : null;

            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            const response = await fetch(`http://15.165.14.203/api/member-data/delete-product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                console.log('Product deleted successfully');
                onDelete(id);
            } else {
                console.error('Failed to delete the product');
            }
        } catch (error) {
            console.error('Error deleting the product:', error);
        }
    };

    const handleSave = (updatedProduct) => {
        onEdit(id, updatedProduct);
        setIsEditing(false);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <ProductImage src={productImage} alt="Product Image" />
                </TableCell>
                <TableCell>
                    <ProductDetails>
                        <ProductName>{productName}</ProductName>
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
            {isEditing && (
                <AddProduct
                    productId={id}
                    onSave={handleSave}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

Product.propTypes = {
    id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productImage: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default Product;
