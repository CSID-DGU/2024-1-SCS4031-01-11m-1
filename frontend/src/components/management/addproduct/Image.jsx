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

const Uploadcontainer = styled.div`
  display: flex;
  width: 280px;
  height: 18px;
  justify-content: left;
  align-items: flex-start;
  flex-shrink: 0;
`;

const Box = styled.div`
  width: 163px;
  height: 18px;
  flex-shrink: 0;
  border: 0.5px solid #D9D9D9;
  background: #F2F2F2;
  margin-top:11px;
  margin-bottom:10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  color: #727272;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // hover 시 전체 파일명 표시
  &:hover {
    white-space: initial;
    overflow: initial;
    text-overflow: initial;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Button = styled.label`
  display: flex;
  height: 18px;
  padding: 8px 16px;
  margin-top:11px;
  margin-bottom:10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 0px 2px 2px 0px;
  background: #1C3159;
  color: #FFF;
  text-align: center;
  font-family: "Wanted Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Imagecondition = styled.p`
  color: #727272;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top:20px;
`;

function Image({ onImageUpload }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onImageUpload(file); 
    }
  };

  return (
    <>
      <Title>Image</Title>
      <Uploadcontainer>
        <Box>{fileName}</Box>
        <HiddenInput id="fileInput" type="file" onChange={handleFileChange} />
        <Button htmlFor="fileInput">Choose Image</Button>
      </Uploadcontainer>
      <Imagecondition>500kB 이하의 jpg, png 파일만 업로드 가능합니다.</Imagecondition>
    </>
  );
}

export default Image;
