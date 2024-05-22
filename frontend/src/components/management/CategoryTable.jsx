import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Category from './Category';

const TableContainer = styled.div`
  margin: 20px;
`;

const Table = styled.table`
  width: 100%;
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
  width: ${(props) => props.width || 'auto'};
`;

const TableHeaderCell = styled.th`
  color: #878787;
  font-family: "Wanted Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: left;
  width: ${(props) => props.width || 'auto'};
  border-bottom: 1px solid #ccc;
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
  background-color: ${({ active }) => active ? 'transparent' : 'transparent'};
  color: ${({ active }) => active ? '#1C3159' : ' #D9D9D9'};
  border-radius: 5px;
`;

function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const categorysPerPage = 13;
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const accessToken = userInfo ? userInfo.accessToken : null;
        const memberId = userInfo ? userInfo.memberId : null;

        if (!accessToken || !memberId) {
          console.error('Access token or member ID not found');
          return;
        }

        const response = await axios.get(`http://15.165.14.203/api/member-data/category/${memberId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCategorys(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategorys();
  }, []);

  const handleDeleteCategory = (categoryId) => {
    setCategorys(categorys.filter((category) => category.id !== categoryId));
  };

  const handleEditCategory = (categoryId, updatedCategory) => {
    setCategorys(
      categorys.map((category) =>
        category.id === categoryId ? updatedCategory : category
      )
    );
  };

  const totalPages = Math.ceil(categorys.length / categorysPerPage);
  const indexOfLastCategory = currentPage * categorysPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categorysPerPage;
  const currentCategorys = categorys.slice(indexOfFirstCategory, indexOfLastCategory);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeaderCell width="40%">Category</TableHeaderCell>
            </TableRow>
          </thead>
          <tbody>
            {currentCategorys.map((category) => (
              <Category
                key={category.id}
                id={category.id}
                categoryName={category.categoryName} 
                onDelete={handleDeleteCategory}
                onEdit={handleEditCategory}
              />
            ))}
          </tbody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>
    </>
  );
}

export default CategoryTable;
