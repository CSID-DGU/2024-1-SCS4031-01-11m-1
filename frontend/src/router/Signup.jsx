import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: #F5F7FA;
`;

const Left = styled.div`
    width: 59%;
    height: 100%;
    display: flex;
    background: linear-gradient(180deg, #006DDC 0%, #02298A 84.79%, #1C3159 100%);
    position: absolute;
    left: 0px;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 23px;
    position: absolute;
    margin-left: 135px;
    margin-top: 438px;
`;

const Logo = styled.p`
    color: #FFF;
    font-family: "Wanted Sans";
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 23px; 
`;

const Text = styled.p`
    color: #FFF;
    font-family: "Wanted Sans";
    font-size: 18px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
`;

const Right = styled.div`
    width: 41%;
    height:100%;
    position:absolute;
    right:0px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RightBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 23px;
`;

const Hello = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const Welcom = styled.p`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const Input = styled.input`
    width: 307px;
    padding: 18px 26px;
    border-radius: 30px;
    border: 1px solid #EEE;
    background: #FFF;
`;

const Button = styled.button`
    width: 307px;
    padding: 18px 26px;
    border-radius: 30px;
    background: #1C3159;
    color: #fff;
`;

const SignUpLink = styled(Link)`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    opacity: 0.7;
`;

const ErrorMessage = styled.p`
    color: red;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

function Login() {
    const [username, setName] = useState('');
    const [name, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    id: name,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                history.push('/login');
            } else {
                setError('회원가입에 실패하였습니다.');
                console.error('Registration failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container>
            <Left>
                <Box>
                    <Logo>GoVOC</Logo>
                    <Text>Listen customer’s voice</Text>
                </Box>
            </Left>
            <Right>
                <RightBox>
                    <Hello>Hello!</Hello>
                    <Welcom>Sign Up to Get Started</Welcom>
                    <Input
                        type="text"
                        placeholder="Full Name"
                        value={username}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="ID"
                        value={name}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleRegister}>Register</Button>
                    <SignUpLink to="/login">Already have an account? Login</SignUpLink>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </RightBox>
            </Right>
        </Container>
    );
}

export default Login;
