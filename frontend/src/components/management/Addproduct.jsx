import React from 'react';
import styled from 'styled-components';
import Image from './addproduct/Image';

const Container = styled.div`
    width: 307px;
    height: 592px;
    border-radius: 10px;
    background: #FFF;

    padding:26px;
`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

function Addproduct (){
    return(
        <Container>
            <Title>Add product</Title>
            <Image />
        </Container>
        
    )
}

export default Addproduct;