// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components';
import MenuItems from './MenuItems';
import {Link} from "react-router-dom";
import './styles.css';
import logo from './images/logo.png';

const SidebarContainer = styled.div`
    width: 270px;
    max-width: 100%;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
`;

const SidebarContainerClone = styled.div`
    width: 270px;
    max-width: 100%;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
    margin-bottom: 53px; /* Отступ снизу 53px */
    margin-top: 37px; /* Отступ сверху 37px */
`;

const AuthButton = styled.button`
    border-radius: 10px;
    background-color: #95AAD3;
    color: white;
    width: 192px;
    height: 48px;
    font-family: 'GOST Type A', cursive;
    font-size: 18px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
`;

const Sidebar = () => {
    return (
        <div className="main-menu-container">
            <SidebarContainerClone/>
            <SidebarContainer>
                <Logo src={logo} alt="Логотип"/>
                <Link to="/weekly-tasks">
                    <AuthButton>Weekly tasks</AuthButton>
                </Link>
                <MenuItems/>
            </SidebarContainer>
        </div>
    );
};

export default Sidebar;