import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logout_icon from '../image/logout_icon.png';

const ProfileContainer = styled.div`
    width: 202px;
    height: 61px;
    flex-shrink: 0;
    margin-top: 8px;
    display: flex;
    align-items: center; /* Align items vertically */
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 32px; 
`;

const NameLabel = styled.span`
    color: #000;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const IdLabel = styled.span`
    color: #000;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const Logout = styled.img`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
`;

function Profile() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // userInfo 객체 가져오기

    // userInfo 객체가 있는지 확인 후 정보 사용
    const username = userInfo ? userInfo.memberName : "";
    const name = userInfo ? userInfo.name : "";

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    }
    
    return (
        <ProfileContainer>
            <ProfileInfo>
                <NameLabel>{username}</NameLabel>
                <IdLabel>@ {name}</IdLabel>
            </ProfileInfo>
            <Link to="/login">
                <Logout src={logout_icon} alt="Logout" onClick={handleLogout} />
            </Link>
        </ProfileContainer>
    );
}


export default Profile;

