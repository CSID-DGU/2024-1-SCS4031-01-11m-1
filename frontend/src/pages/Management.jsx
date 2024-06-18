import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from "./Navbar";
import Tab from "../components/management/Tab"
import ProductTable from "../components/management/ProductTable";
import MeetingMinutesTable from "../components/management/MeetingMinutesTable";
import CategoryTable from "../components/management/CategoryTable"
import plusicon from '../components/image/plus_icon.png';
import Addproduct from '../components/management/Addproduct';
import Addminute from '../components/management/Addminute';
import Addcategory from '../components/management/AddCategory';


const Container = styled.div`
    width: 100%;
    height: 83vh;
    background-color: #F5F7FA;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    align-items: center; 
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 27px;
    margin-left: 40px;
`;

const ListContainer = styled.div`
    width: 1430px;
    height: 800px; 
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #DFDFDF;
    background: #FFF;
`;

const AddProductbtn = styled.button`
    display: flex;
    width: 116px;
    height: 31px;
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #1C3159;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.25);
    color: #DFDFDF;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    position:relative;
    left:88%;
    top:15px;
`;

const AddMinutebtn = styled.button`
    display: flex;
    width: 116px;
    height: 31px;
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #1C3159;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.25);
    color: #DFDFDF;
    text-align: center;
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    position:relative;
    left:88%;
    top:10px;
`;

const Addicon = styled.div`
    background: url(${plusicon});
    background-repeat: no-repeat;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
`;

function Management() {
    const [activeTab, setActiveTab] = useState('Product');
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showAddMinuteModal, setShowAddMinuteModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    const handleAddProductClick = () => {
        setShowAddProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowAddProductModal(false);
    };

    const handleAddMinuteClick = () => {
        setShowAddMinuteModal(true);
    }
    
    const handleCloseMinuteModal = () => {
        setShowAddMinuteModal(false);
    }

    const handleAddCategoryClick = () => {
        setShowAddCategoryModal(true);
    }
    const handleCloseCategoryModal = () => {
        setShowAddCategoryModal(false);
    }

    return (
        <>
            <Navbar />
            <Title>Management</Title>
            <Container>
                <ListContainer>
                    <Tab onTabChange={handleTabChange} />

                    {activeTab === 'Product' && (
                        <>
                            <AddProductbtn onClick={handleAddProductClick}>
                                <Addicon src={plusicon} />
                                Add Product
                            </AddProductbtn>
                            <ProductTable />
                            
                        </>
                    )}
                    {activeTab === 'Meeting Minutes' && (
                        <>
                            <AddMinutebtn onClick={handleAddMinuteClick}>
                                <Addicon src={plusicon} />
                                Add minute
                            </AddMinutebtn>
                            <MeetingMinutesTable />
                        </>
                    )}
                    {activeTab === 'Category' && (
                        <>
                            <AddMinutebtn onClick={handleAddCategoryClick}>
                                <Addicon src={plusicon} />
                                Add category
                            </AddMinutebtn>
                            <CategoryTable />
                        </>
                    )}
                </ListContainer>
            </Container>
            {showAddProductModal && <Addproduct onClose={handleCloseProductModal} />}
            {showAddMinuteModal && <Addminute onClose={handleCloseMinuteModal} />}
            {showAddCategoryModal && <Addcategory onClose={handleCloseCategoryModal} />}
        </>
    );
}

export default Management;
