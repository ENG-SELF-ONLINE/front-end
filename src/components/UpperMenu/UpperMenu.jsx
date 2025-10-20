// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Drawer, Progress } from "antd";
import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './styles.css';
import avatar from './images/avatar.png';
import exit from './images/exit.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const icons = {
    avatar: avatar,
    exit: exit,
};

const UpperMenu = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [nextLevel, setNextLevel] = useState(null);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get('http://localhost:8084/notifications', config);
                setNotifications(response.data);
            } catch (error) {
                console.error('Ошибка при получении уведомлений:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get('http://localhost:8084/users/api', config);
                setUser(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        const fetchNextLevel = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get('http://localhost:8084/users/next-level', config);
                setNextLevel(response.data);
            } catch (error) {
                console.error('Ошибка при получении следующего уровня:', error);
            }
        };

        const fetchProgressPercentage = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get('http://localhost:8086/statistics/common-progress/percent', config);
                setProgressPercentage(response.data);
            } catch (error) {
                console.error('Ошибка при получении процента прогресса:', error);
            }
        };

        fetchNotifications();
        fetchUserData();
        fetchNextLevel();
        fetchProgressPercentage();

        const timer = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleOpenDrawer = () => {
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const updateFriendRequest = async (friendshipId, status) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            const response = await axiosInstance.put(
                `http://localhost:8084/friendships/${friendshipId}?status=${status}`,
                {},
                config
            );

            if (response.status === 200) {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.contextId !== friendshipId)
                );
                console.log(`Успешно обновлен статус заявки ${friendshipId} на ${status}`);
            } else {
                console.error(`Ошибка при обновлении статуса заявки ${friendshipId}:`, response);
            }
        } catch (error) {
            console.error(`Ошибка при отправке запроса на обновление статуса ${friendshipId}:`, error);
        }
    };

    const handleAccept = (friendshipId) => {
        updateFriendRequest(friendshipId, 'ACCEPTED');
    };

    const handleDecline = (friendshipId) => {
        updateFriendRequest(friendshipId, 'REJECTED');
    };

    const handleAcceptProgressUpdate = async (notificationId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            const response = await axiosInstance.post(
                `http://localhost:8084/notifications/${notificationId}/accept`,
                {},
                config
            );

            if (response.status === 200) {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.notificationId !== notificationId)
                );
                console.log(`Успешно принято обновление прогресса для уведомления ${notificationId}`);
                window.location.reload();
            } else {
                console.error(`Ошибка при принятии обновления прогресса для уведомления ${notificationId}:`, response);
            }
        } catch (error) {
            console.error(`Ошибка при отправке запроса на принятие обновления прогресса для уведомления ${notificationId}:`, error);
        }
    };

    const getAvatarUrl = (photo) => {
        return `http://localhost:9999/files/images/show?bucket=PROFILE&file=${photo}`;
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axiosInstance.post('http://localhost:8888/logout', refreshToken, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/'); // Redirect to login page
            } else {
                console.error('Logout failed:', response);
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className="upper-menu-container">
            <div className="header">
                <div className="level-container">
                    {user && <span className="level">{user.level}</span>}
                    <div className="progress-bar">
                        {window.innerWidth > 1070 && (
                            <Progress percent={progressPercentage} showInfo={false} />
                        )}
                    </div>
                    {nextLevel && <span className="level">{nextLevel}</span>}
                </div>
                <div className="header-icon ring-icon" onClick={handleOpenDrawer}>
                    <BellOutlined style={{ fontSize: '25px', cursor: 'pointer' }} />
                    {notifications.length > 0 && <span className="notification-indicator"></span>}
                </div>
                {user && (
                    <div className={`header-icon avatar-icon`} onClick={() => {
                        window.location.href = '/settings';
                    }}>
                        <img
                            src={user.photo ? getAvatarUrl(user.photo) : icons.avatar}
                            alt="Аватар"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}
                <div className={`header-icon exit-icon`} onClick={handleLogout}>
                    <img src={icons.exit} alt="Выход" />
                </div>
            </div>

            <Drawer
                title="Уведомления"
                visible={drawerVisible}
                onClose={handleCloseDrawer}
                width={400}
                bodyStyle={{padding: 0}}
            >
                <div className="notification-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {notifications.length > 0 ? notifications.map((notification) => (
                        <div className="notification-item" key={notification.notificationId}>
                            {notification.type === 'FRIEND_REQUEST' && (
                                <img
                                    src={notification.sender.photo ? getAvatarUrl(notification.sender.photo) : avatar}
                                    alt="Аватар"
                                    className="notification-avatar"
                                />
                            )}
                            <div className="notification-text">
                                {notification.type === 'FRIEND_REQUEST' ? (
                                    <>
                                        <span>{notification.sender.firstName} {notification.sender.lastName}</span>
                                        <div className="notification-buttons" style={{display: 'flex', gap: '10px'}}>
                                            <CheckOutlined
                                                style={{cursor: 'pointer', fontSize: '20px', color: 'green'}}
                                                onClick={() => handleAccept(notification.contextId)}
                                            />
                                            <CloseOutlined
                                                style={{cursor: 'pointer', fontSize: '20px', color: 'red'}}
                                                onClick={() => handleDecline(notification.contextId)}
                                            />
                                        </div>
                                    </>
                                ) : notification.type === 'PROGRESS_UPDATE' ? (
                                    <>
                                        <span>{notification.message}</span>
                                        <div className="notification-buttons" style={{display: 'flex', gap: '10px'}}>
                                            <CheckOutlined
                                                style={{cursor: 'pointer', fontSize: '20px', color: 'green'}}
                                                onClick={() => handleAcceptProgressUpdate(notification.notificationId)}
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )) : (
                        <div/>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default UpperMenu;