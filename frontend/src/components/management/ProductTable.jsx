import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Product from './Product';


const TableContainer = styled.div`
  width: 100%;
  margin: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 96%;
  border-collapse: collapse;
  margin: auto;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
  height: 30px;
`;

const TableCell = styled.td`
    color: #878787;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    width: ${props => props.width || 'auto'}; 
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: fixed;
  bottom: 20px; 
  width: 100%;
  z-index: 1000; 
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: "Wanted Sans";
  cursor: pointer;
  border: none;
  background-color:${({ active }) => active ? 'transparent' : 'transparent'};
  color: ${({ active }) => active ? '#1C3159' : ' #D9D9D9'};
  border-radius: 5px;
`;


function ProductTable({ memberId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [products, setProducts] = useState([]);
 


  //페이지네이션 변수
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchProducts = async () => {
        const response = await axios.get(`/member-data/products/${memberId}`);
        setProducts(response.data);
    };

    fetchProducts();
  }, [memberId]);
  return (
    <>
    
      
    <TableContainer>
      <Table>
        <tbody>
          <TableRow>
            <TableCell width="5%">ID</TableCell>
            <TableCell width="10%">Image</TableCell>
            <TableCell width="45%">Product</TableCell>
            <TableCell width="25%">URL</TableCell>
            <TableCell width="5%"></TableCell>
          </TableRow>
          {currentProducts.map((product) => (
              <Product key={product.id} {...product} />
            ))}
        </tbody>
      </Table>
    </TableContainer>
      <PaginationContainer>
      {Array.from({ length: totalPages }, (_, index) => (
        <PaginationButton
          key={index}
          active={currentPage === index + 1}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </PaginationButton>
      ))}
    </PaginationContainer>
  </>
  );
}

export default ProductTable;
