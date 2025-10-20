import {useEffect, useState} from 'react';
import {Menu} from 'antd';
import styled from 'styled-components';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    BarChartOutlined,
    ClockCircleOutlined,
    FileWordOutlined,
    HeartOutlined,
    ReadOutlined,
    RobotOutlined,
    SettingOutlined,
    SoundOutlined,
    TranslationOutlined,
    UnorderedListOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';

const generateLevelItems = (type) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels.map((level) => ({
        key: `${type.toLowerCase()}-${level}`,
        label: `${level}: ${getLevelDescription(level)}`,
        path: `/${type.toLowerCase()}/${level}`,
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
        label: 'Статистика',
        path: '/statistics', // Добавляем путь для Statistics
    },
    {
        key: '2',
        icon: <UsergroupAddOutlined/>, // Изменяем иконку на друзей
        label: 'Друзья',
        path: '/friends', // Добавляем путь для Friends
    },
    {
        key: '3',
        icon: <HeartOutlined/>, // Изменяем иконку на сердечко
        label: 'Избранные книги',
        path: '/favourites', // Добавляем путь для Favourites
    },
    {
        key: 'sub1',
        label: 'Чтение',
        icon: <ReadOutlined/>,
        children: generateLevelItems('Reading'),
    },
    {
        key: 'sub2',
        label: 'Грамматика',
        icon: <FileWordOutlined/>,
        children: generateLevelItems('Grammar'),
    },
    {
        key: 'sub3',
        label: 'Аудирование',
        icon: <SoundOutlined/>,
        children: generateLevelItems('Listening'),
    },
    {
        key: '4',
        icon: <UnorderedListOutlined/>,
        label: 'Словарь',
        path: '/dictionary', // Добавляем путь для Dictionary
    },
    {
        key: '5',
        icon: <TranslationOutlined/>,
        label: 'Переводчик',
        path: '/translator', // Добавляем путь для Translator
    },
    {
        key: '6',
        icon: <ClockCircleOutlined/>,
        label: 'Трекер',
        path: '/tracker', // Добавляем путь для Tracker
    },
    {
        key: '7',
        icon: <RobotOutlined/>, // Изменяем иконку на робота
        label: 'ИИ-Тренажер',
        path: '/helper', // Добавляем путь для AI Helper
    },
    {
        key: '8',
        icon: <SettingOutlined/>,
        label: 'Профиль',
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
`;

const findMenuItemByKey = (key) => {
    for (const item of menuItems) {
        if (item.key === key) return item;
        if (item.children) {
            const child = item.children.find(child => child.key === key);
            if (child) return child;
        }
    }
    return null;
};

const getSelectedKey = (pathname) => {
    for (const item of menuItems) {
        if (item.path && item.path === pathname) return item.key;
        if (item.children) {
            const child = item.children.find(child => child.path === pathname);
            if (child) return child.key;
        }
    }
    return null; // Возвращаем null, если путь не найден
};

const MenuItems = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedMenuKey') || '1');

    useEffect(() => {
        const handleLocationChange = () => {
            const newSelectedKey = getSelectedKey(location.pathname);
            // Если найден соответствующий ключ, обновляем состояние и localStorage
            if (newSelectedKey) {
                setSelectedKey(newSelectedKey);
                localStorage.setItem('selectedMenuKey', newSelectedKey);
            }
        };

        handleLocationChange(); // Вызываем при первом рендере и при изменении location.pathname
    }, [location.pathname, setSelectedKey]);


    const handleMenuItemClick = (e) => {
        const item = findMenuItemByKey(e.key);
        if (item && item.path) {
            setSelectedKey(e.key); // Обновляем состояние перед переходом
            localStorage.setItem('selectedMenuKey', e.key);
            navigate(item.path);
        }
    };

    return (
        <div style={{width: 256, maxHeight: '80vh', overflowY: 'auto'}}>
            <StyledMenu
                defaultSelectedKeys={[selectedKey || '1']} // Используем selectedKey или '1' по умолчанию
                selectedKeys={[selectedKey || '1']} // Используем selectedKey или '1' по умолчанию
                mode="inline"
                theme="light"
                items={menuItems}
                onClick={handleMenuItemClick}
            />
        </div>
    );
};

export default MenuItems;