import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Profile from "../components/navbar/Profile";

const NavbarContainer = styled.div`
    width: 100%;
    height: 50px;
    background-color: #FDFDFD;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 28px 9px 30px;
`;

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 85px;
`;

const NavbarLink = styled(Link)`
    color: ${({ active }) => active ? '#1C3159' : '#B4B4B4'};
    font-family: "Wanted Sans";
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        color: #1C3159;
    }
`;

function Navbar() {
    const location = useLocation();

    return (
        <NavbarContainer>
            <TextContainer>
                <NavbarLink to="/dashboard" active={location.pathname === '/dashboard' ? 1 : 0}>Dashboard</NavbarLink>
                <NavbarLink to="/analytics" active={location.pathname.startsWith('/analytics') ? 1 : 0}>Analytics</NavbarLink>
                <NavbarLink to="/management" active={location.pathname === '/management' ? 1 : 0}>Management</NavbarLink>
            </TextContainer>
            <Profile />
        </NavbarContainer>
    );
}

export default Navbar;
