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
    height: 173px;
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

function Document({ onDocumentSelect }) {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.memberId && userInfo.accessToken) {
            setMemberId(userInfo.memberId);
            setAccessToken(userInfo.accessToken);
        }
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            if (memberId && accessToken) {
                try {
                    const response = await axios.get(`http://15.165.14.203/api/member-data/product-minutes/${memberId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setDocuments(response.data);
                } catch (error) {
                    console.error("Failed to fetch documents", error);
                }
            }
        };

        fetchDocuments();
    }, [memberId, accessToken]);

    const handleItemClick = (document) => {
        const newSelectedDocument = selectedDocument === document ? null : document;
        setSelectedDocument(newSelectedDocument);
        onDocumentSelect(newSelectedDocument);
    };

    return (
        <>
            <Title>Document</Title>
            <Container>
                {documents.map((document) => (
                    <Item
                        key={document.id}
                        isSelected={selectedDocument === document}
                        onClick={() => handleItemClick(document)}
                    >
                        {document.minuteName}
                    </Item>
                ))}
            </Container>
        </>
    );
}

export default Document;
