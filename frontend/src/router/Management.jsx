import Navbar from "../components/navbar"
import styled from 'styled-components'

const Container = styled.div`

`;

const Title = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    opacity: 0.77;
`;

function Management() {
    return(
        <>
            <Navbar />
            <Title>Management</Title>
            <Container>
                
            </Container>
        </>
        
        

    );
}

export default Management;