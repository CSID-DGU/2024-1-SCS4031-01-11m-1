import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
    return (
        <ProfileContainer>
            <ProfileInfo>
                <NameLabel>김수영</NameLabel>
                <IdLabel>@ksy0313</IdLabel>
            </ProfileInfo>
            <Link to="/login">
                <Logout src={logout_icon} alt="Logout" />
            </Link>
        </ProfileContainer>
    );
}

export default Profile;
