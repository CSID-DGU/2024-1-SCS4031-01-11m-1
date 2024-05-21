import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import morebutton_icon from '../image/morebutton_icon.png';
import AddMinute from './AddMinute';

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

const FileName = styled.a`
    cursor: pointer;
    text-decoration: underline;
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




const Minute = ({ id, minuteName, minute, fileUrl, onDelete, onEdit }) => {
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

            const response = await fetch(`http://15.165.14.203/api/member-data/delete-product-minute/${id}`, {
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

    // Remove the "/media/" prefix from the minute value
    const displayMinute = minute.replace('/media/', '');

    return (
        <>
        <TableRow>
            <TableCell>
                {minuteName}
            </TableCell>
            <TableCell>
                <FileName href={fileUrl} download>{displayMinute}</FileName>
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
            <AddMinute
                minuteId={id}
                onSave={handleSave}
                onClose={handleClose}
            />
        )}
        </>
    );
};

Minute.propTypes = {
    id: PropTypes.string.isRequired,
    minuteName: PropTypes.string.isRequired,
    minute: PropTypes.string.isRequired,
    fileUrl: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default Minute;
