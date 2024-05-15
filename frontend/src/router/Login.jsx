import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../api/axios';
import { useRecoilState } from "recoil";
import { userState } from "../context/authState";

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
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useRecoilState(userState);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://15.165.14.203/api/auth/sign-in', { 
                name: name,
                password: password,
            });
            

            if (response.status === 201) {
                console.log('Login successful:', response.data);
                // 로그인 성공 시 원하는 동작 - dashboard로 이동
                const accessToken = response.data.accessToken;
                const memberId = response.data.memberId;
                const memberName = response.data.memberName;
                
                setUserInfo({
                    accessToken: accessToken,
                    memberId: memberId,
                    memberName: memberName,
                    name: name,
                });

                localStorage.setItem(
                    "userInfo",
                    JSON.stringify({
                    accessToken: accessToken,
                    memberId: memberId,
                    memberName: memberName,
                    name: name,
                    })
                );
                navigate('/dashboard')
            } else {
                setError('로그인에 실패하였습니다.');
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            setError('로그인에 실패하였습니다.');
            console.error('Error during login:', error);
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
                    <Hello>Hello Again!</Hello>
                    <Welcom>Welcome Back</Welcom>
                    <Input
                        type="text"
                        placeholder="ID"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLogin}>Login</Button>
                    <SignUpLink to="/signup">Sign Up</SignUpLink>
                    
                </RightBox>
            </Right>
        </Container>
    );
}

export default Login;
