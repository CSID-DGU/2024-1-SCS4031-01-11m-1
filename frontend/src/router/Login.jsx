import { useState } from 'react';
import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트를 import합니다.
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
    justify-content: center; /* 가운데 정렬을 위해 추가 */
    align-items: center; /* 가운데 정렬을 위해 추가 */
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
    color:#fff;
`;

const SignUpLink = styled(Link)`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    opacity: 0.7;
    margin-left:127px;
`;

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 여기에 로그인 처리 로직
        console.log('ID:', id);
        console.log('Password:', password);
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
                    <Hello>Hello Again!</Hello>
                    <Welcom>Welcome Back</Welcom>
                    <Input
                        type="text"
                        placeholder="ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLogin}>Login</Button>
                    {/* Sign Up 링크 추가 */}
                    <SignUpLink to="/signup">Sign Up</SignUpLink>
                </RightBox>
            </Right>
        </Container>
    );
}

export default Login;
