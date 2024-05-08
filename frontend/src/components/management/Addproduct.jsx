import React from 'react';
import styled from 'styled-components';
import Image from './addproduct/Image';

const Container = styled.div`
    width: 307px;
    height: 592px;
    border-radius: 10px;
    background: #FFF;
`;

function Addproduct (){
    return(
        <Container>
            <Image />
        </Container>
        
    )
}

export default Addproduct;