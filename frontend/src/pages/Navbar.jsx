import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Profile from "../components/navbar/Profile";

const NavbarContainer = styled.div`
    width:100%;
    height:50px;
    background-color: #FDFDFD;
    display: inline-flex;
    padding: 8px 28px 9px 30px;
    justify-content: space-between;
    align-items: center;
    gap: 20%;
    
`;

const TextContainer = styled.div`
    width:410px;
    height:18px;
    display: flex;
    align-items: flex-start;
    gap: 85px;
`;

const NavbarLink = styled(Link)`
    color: ${({ active }) => active ? '#1C3159' : '#B4B4B4'};
    font-family: "Wanted Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

function Navbar() {
    const location = useLocation();

    return (
        <NavbarContainer>
            <TextContainer>
                <NavbarLink to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavbarLink>
                <NavbarLink to="/analytics" active={location.pathname === '/analytics'}>Analytics</NavbarLink>
                <NavbarLink to="/management" active={location.pathname === '/management'}>Management</NavbarLink>
            </TextContainer>
            <Profile />
        </NavbarContainer>
    );
}

export default Navbar;
