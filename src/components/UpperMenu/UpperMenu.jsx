// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Drawer, Progress } from "antd";
import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './styles.css';
import avatar from './images/avatar.png';
import exit from './images/exit.png';

const icons = {
    avatar: avatar,
    exit: exit,
};

const UpperMenu = () => {
    const [hasNotifications, setHasNotifications] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const notifications = [
        { id: 1, name: "Иван", surname: "Иванов", avatar: avatar },
        { id: 2, name: "Петр", surname: "Петров", avatar: avatar },
        { id: 3, name: "Сергей", surname: "Сергеев", avatar: avatar },
        // Добавьте больше уведомлений здесь
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setHasNotifications(prev => !prev);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleOpenDrawer = () => {
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const handleAccept = (id) => {
        console.log(`Принято уведомление ${id}`);
        // Здесь добавьте логику для принятия уведомления
    };

    const handleDecline = (id) => {
        console.log(`Отклонено уведомление ${id}`);
        // Здесь добавьте логику для отклонения уведомления
    };

    return (
        <div className="upper-menu-container">
            <div className="header">
                <div className="level-container">
                    <span className="level">A1</span>
                    <div className="progress-bar">
                        <Progress percent={50} showInfo={false} />
                    </div>
                    <span className="level">A2</span>
                </div>
                <div className="header-icon ring-icon" onClick={handleOpenDrawer}>
                    <BellOutlined style={{ fontSize: '25px', cursor: 'pointer' }} />
                    {hasNotifications && <span className="notification-indicator"></span>}
                </div>
                {Object.entries(icons).slice(0, 2).map(([key, src]) => (
                    <div key={key} className={`header-icon ${key}-icon`} onClick={() => {
                        if (key === 'avatar') {
                            window.location.href = '/settings';
                        } else if (key === 'exit') {
                            window.location.href = '/exit';
                        }
                    }}>
                        <img src={src} alt={key === 'avatar' ? 'Аватар' : 'Выход'} />
                    </div>
                ))}
            </div>
            <div className="header-clone"></div>

            <Drawer
                title="Уведомления"
                visible={drawerVisible}
                onClose={handleCloseDrawer}
                width={400}
                bodyStyle={{ padding: 0 }}
            >
                <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.map((notification) => (
                        <div className="notification-item" key={notification.id}>
                            <img src={notification.avatar} alt="Аватар" className="notification-avatar" />
                            <div className="notification-text">
                                <span>{notification.name} {notification.surname}</span>
                                <div className="notification-buttons" style={{ display: 'flex', gap: '10px' }}>
                                    <CheckOutlined
                                        style={{ cursor: 'pointer', fontSize: '20px', color: 'green' }}
                                        onClick={() => handleAccept(notification.id)}
                                    />
                                    <CloseOutlined
                                        style={{ cursor: 'pointer', fontSize: '20px', color: 'red' }}
                                        onClick={() => handleDecline(notification.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    );
}

export default UpperMenu;