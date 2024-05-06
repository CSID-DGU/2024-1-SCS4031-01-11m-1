import React from 'react';
import styled from 'styled-components';
import productimg from '../image/image1_example.jpg'


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
    padding:10px;
`;


const Image = styled.img`

`;

const ImageContainer = styled.div`
    width:85px;
    height: 85px;
    background: url(${productimg});
    background-size : cover;
    flex-shrink: 0;
    border-radius: 5px;
    
`;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    justify-content: flex-start;
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
    letter-spacing:1px;
    text-align: left;
`;

const Product = () => (
    <TableRow>
        <TableCell>1</TableCell>
        <TableCell>
            <ImageContainer>
                <Image />
            </ImageContainer>
        </TableCell>
        <TableCell>
            <ProductContainer>
                <ProductName>에버모이스트 리프레쉬 수분 크림</ProductName>
                <ProductExplanation>피부를 즉각적으로 촉촉하게 가득 채워주는 효과적인 보습 크림입니다. 이 제품은 풍부한 수분 공급과 동시에 가벼운 질감으로 피부에 무겁지 않게 흡수되어 촉촉한 윤기를 선사합니다. 특히, 피부의 건조함을 완화하고 탄력을 증진하여 건조한 피부를 위한 이deal한 보습 솔루션입니다. 에버모이스트 리프레쉬 수분 크림은 자연유래 성분으로 피부를 부드럽게 케어하며, 지루함 없는 즉각적인 보습 효과를 제공하여 피부를 촉촉하고 생기 있게 가꿔줍니다.</ProductExplanation>
            </ProductContainer>
        </TableCell>
        <TableCell>
            <a href="https://example.com/product" target="_blank" rel="noopener noreferrer">
                https://example.com/product
            </a>
        </TableCell>
    
    </TableRow>
);

export default Product;
