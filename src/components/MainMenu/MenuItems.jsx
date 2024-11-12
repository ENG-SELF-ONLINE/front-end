// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components';
import { Menu } from 'antd';
import { BarChartOutlined, ReadOutlined, FileWordOutlined, SoundOutlined, UnorderedListOutlined, TranslationOutlined, AuditOutlined, SettingOutlined } from '@ant-design/icons';

// Генерация элементов уровня (A1-C2) для Reading, Grammar и Listening
const generateLevelItems = (type) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels.map((level) => ({
        key: `${type.toLowerCase()}-${level}`,
        label: `${level}: ${getLevelDescription(level)}`,
        path: `/${type.toLowerCase()}/${level}`, // Добавляем путь для каждого уровня
    }));
};

const getLevelDescription = (level) => {
    const descriptions = {
        A1: 'Elementary',
        A2: 'Pre-intermediate',
        B1: 'Intermediate',
        B2: 'Upper-intermediate',
        C1: 'Advanced',
        C2: 'Proficiency',
    };
    return descriptions[level] || '';
};

// Определяем элементы меню
const menuItems = [
    {
        key: '1',
        icon: <BarChartOutlined/>,
        label: 'Statistics',
        path: '/statistics', // Добавляем путь для Statistics
    },
    {
        key: 'sub1',
        label: 'Reading',
        icon: <ReadOutlined/>,
        children: generateLevelItems('Reading'),
    },
    {
        key: 'sub2',
        label: 'Grammar',
        icon: <FileWordOutlined/>,
        children: generateLevelItems('Grammar'),
    },
    {
        key: 'sub3',
        label: 'Listening',
        icon: <SoundOutlined/>,
        children: generateLevelItems('Listening'),
    },
    {
        key: '2',
        icon: <UnorderedListOutlined/>,
        label: 'Dictionary',
        path: '/dictionary', // Добавляем путь для Dictionary
    },
    {
        key: '3',
        icon: <TranslationOutlined/>,
        label: 'Translator',
        path: '/translator', // Добавляем путь для Translator
    },
    {
        key: '4',
        icon: <AuditOutlined/>,
        label: 'Tracker',
        path: '/tracker', // Добавляем путь для Tracker
    },
    {
        key: '5',
        icon: <SettingOutlined/>,
        label: 'Settings',
        path: '/settings', // Добавляем путь для Settings
    },
];

const StyledMenu = styled(Menu)`
    .ant-menu-vertical-inner {
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
        font-family: 'GOST Type A', cursive;
        color: #583D3D;
        margin-top: 10px;
    }
;
`

const MenuItems = () => {
    const handleClick = (e) => {
        const itemKey = e.key;

        const findItemPath = (key) => {
            for (const item of menuItems) {
                if (item.key === key && item.path) return item.path;
                if (item.children) {
                    const childItem = item.children.find(child => child.key === key);
                    if (childItem) return childItem.path;
                }
            }
            return null;
        };

        const path = findItemPath(itemKey);

        if (path) {
            window.location.href = path;
        }
    };

    return (
        <div style={{ width: 256, maxHeight: '80vh', overflowY: 'auto', marginTop: '33px' }}>
            <StyledMenu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="light"
                items={menuItems}
                onClick={handleClick}
            />
        </div>
    );
};

export default MenuItems;