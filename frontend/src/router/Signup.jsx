import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Form = styled.form`
    display: flex;
    width: 307px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
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

function Signup() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const payload = {
      name: name,
      username: username,
      password: password,
    };
  
    const handleRegister = async () => {
      try {
        const response = await fetch('http://ec2-54-180-116-5.ap-northeast-2.compute.amazonaws.com/api/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (response.status === 201) {
          console.log('Registration successful:');
          navigate('/login');
        } else {
          setError('회원가입에 실패하였습니다.');
          console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        console.log(payload);
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
            <Form>
              <Input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
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
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form>
            <Button onClick={handleRegister}>Register</Button>
            <SignUpLink to="/login">Already have an account? Login</SignUpLink>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </RightBox>
        </Right>
      </Container>
    );
  }
  

export default Signup;
