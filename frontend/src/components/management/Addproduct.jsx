import React, { useState } from 'react';
import styled from 'styled-components';
import Image from './addproduct/Image';
import ProductName from './addproduct/ProductName';
import ProductDescription from './addproduct/ProductDescription';
import URL from './addproduct/URL';


const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 1000; 
    display: flex;
    justify-content: center;
    align-items: center;
`;


const Container = styled.div`
    width: 307px;
    height: 552px;
    border-radius: 10px;
    background: #FFF;
    padding: 26px;
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const Line = styled.p`
    width: 250px;
    height: 1px;
    background: #D9D9D9;
    margin-top: 28px;
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 172px;
    height: 27px;
    justify-content: center;
    align-items: flex-start;
    gap: 14px;
    flex-shrink: 0;
    margin-left: 83px;
    margin-top: 20px;
`;

const SaveButton = styled.button`
    display: flex;
    width: 79px;
    height: 27px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #1C3159;
    color: #FFF;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
`;

const CancelButton = styled.button`
    display: flex;
    width: 79px;
    height: 27px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid #D9D9D9;
    color: #B4B4B4;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
`;

function Addproduct( { onClose }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [url, setUrl] = useState('');

    const handleImageUpload = (image) => {
        setUploadedImage(image);
    };
    const handleProductNameChange = (productName) => {
        setProductName(productName);
    };
    const handleProductDescriptionChange = (productDescription) => {
        setProductDescription(productDescription);
    };
    const handleUrlChange = (newUrl) => {
        setUrl(newUrl);
    };


    const handleSave = () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const accessToken = userInfo ? userInfo.accessToken : null;
    
        // FormData 객체 생성
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productDescription', productDescription);
        formData.append('productUrl', url);
        formData.append('productImage', uploadedImage); 
        
         
        // POST 요청
        fetch('http://15.165.14.203/api/member-data/add-product', {
            method: 'POST',
            headers: {
                // 'Content-type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,  
            },
            body:formData 
        })
        .then(response => {
            if (response.ok) {
                console.log('Product added successfully');
                
                onClose();
            } else {
                console.error('Failed to add product');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    };
    const handleCancel = () => {
        onClose();
    };

    return (
        <ModalOverlay>
            
                <Container>
                    <Title>Add product</Title>
                    <Image onImageUpload={handleImageUpload} />
                    <ProductName onChange={handleProductNameChange} />
                    <ProductDescription onChange={handleProductDescriptionChange} />
                    <URL onChange={handleUrlChange} />
                    <Line />
                    <ButtonContainer>
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                        <SaveButton onClick={handleSave}>Save</SaveButton>
                    </ButtonContainer>
                </Container>
            
        </ModalOverlay>
        
    );
}

export default Addproduct;
