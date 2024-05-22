import React, { useState } from 'react';
import styled from 'styled-components';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top:20px;
`;

const LinkBox = styled.a`
    position: relative;
    width: 253px;
    height: 23px;
    flex-shrink: 0;
    border: 0.5px solid #D9D9D9;
    background: #F2F2F2;
    margin-top: 9px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    text-decoration: none; 

`;

const URLInput = styled.input`
    width: calc(100% - 30px);
    height: 100%;
    border: none;
    background: transparent;
    color: #333;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

function URL({ onChange }) {
  const [url, setUrl] = useState('');

  const handleUrlChange = (event) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    onChange(newUrl);
  };

  return (
    <>
        <Title>URL</Title>
        <LinkBox target="_blank">
            <URLInput 
                type="text" 
                value={url} 
                onChange={handleUrlChange} 
                placeholder="URL을 입력해주세요" 
            />
        </LinkBox>
    </>
  );
}

export default URL;
