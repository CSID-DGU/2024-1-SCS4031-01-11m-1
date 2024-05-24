import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 20px;
`;

const Container = styled.div`
    width: 305px;
    max-height: 173px;
    flex-shrink: 0;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #ccc;
    }
    border-radius: 2.5px;
    border: 1px solid #D9D9D9;
`;

const Item = styled.div`
    color: #333;
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
    padding: 13px;
    background-color: ${({ isSelected }) => (isSelected ? 'rgba(28, 49, 89, 0.30)' : 'transparent')};
    &:hover {
        background-color: rgba(28, 49, 89, 0.30);
    }
`;

function Product({ memberId, accessToken }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://15.165.14.203/api/member-data/products/${memberId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setProducts(response.data); // Adjust based on the actual response structure
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [memberId, accessToken]);

    const handleItemClick = (product) => {
        setSelectedProduct(product);
    };

    return (
        <>
            <Title>Product</Title>
            <Container>
                {products.map((product, index) => (
                    <Item
                        key={index}
                        isSelected={selectedProduct === product}
                        onClick={() => handleItemClick(product)}
                    >
                        {product}
                    </Item>
                ))}
            </Container>
        </>
    );
}

export default Product;
