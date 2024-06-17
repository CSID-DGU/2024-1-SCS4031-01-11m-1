import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
  width: 80px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #B4B4B4;
  background: #FFF;
  font-size: 10px; 
  color: #333;

`;

const ProductDropdown = ({ onSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const accessToken = userInfo ? userInfo.accessToken : null;
        const memberId = userInfo ? userInfo.memberId : null;

        const response = await fetch(`http://15.165.14.203/api/member-data/products/${memberId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('상품 데이터를 불러오는 데 문제가 발생했습니다.');
        }
        const data = await response.json();
        setProducts(data); // API에서 가져온 데이터를 상태에 설정
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
  }, []); // 컴포넌트가 마운트될 때 한 번만 호출하도록 []를 빈 배열로 전달

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProductId(selectedId);
    // onSelect(selectedId); 
    console.log(selectedId); // 콘솔에 선택된 상품의 ID 출력
  };
  return (
    <div>
      <StyledSelect value={selectedProductId} onChange={handleChange}>
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.productName}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

export default ProductDropdown;
