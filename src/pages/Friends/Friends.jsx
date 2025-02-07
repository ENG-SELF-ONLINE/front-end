// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import { Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const getAccessToken = () => {
        return localStorage.getItem('accessToken');
    };

    const getUserIdFromToken = () => {
        const token = getAccessToken();
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.sub;
            } catch (error) {
                console.error("Ошибка декодирования токена:", error);
                return null;
            }
        }
        return null;
    };

    const currentUser = getUserIdFromToken();

    useEffect(() => {
        const fetchFriends = async () => {

            const token = getAccessToken();
            try {
                const response = await axios.get('http://localhost:8084/friendships', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends", error);
            }
        };
        fetchFriends();
    }, []);

    const handleAddFriend = async () => {
        if (foundUser) {
            const token = getAccessToken();
            try {
                // Отправка запроса на добавление друга
                await axios.post(`http://localhost:8084/friendships/${foundUser.userId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                resetModal(); // Сбрасываем модальное окно
            } catch (error) {
                console.error("Error adding friend", error);
                setErrorMessage('Произошла ошибка при добавлении друга');
            }
        }
    };

    const handleDeleteFriend = async (friendId) => {
        const token = getAccessToken();
        try {
            await axios.delete(`http://localhost:8084/friendships/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFriends(friends.filter((friend) => friend.friendshipId !== friendId));
        } catch (error) {
            console.error("Error deleting friend", error);
        }
    };

    const handleVisitFriendProfile = async (friendId, friendUser) => {
        try {
            navigate(`/friends/${friendId}`, { state: { user: friendUser } });
        } catch (error) {
            console.error("Could not navigate to friends profile", error);
        }
    };

    const handleSearchUser = async () => {
        const token = getAccessToken();
        try {
            const response = await axios.get(`http://localhost:8084/users/api/email?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFoundUser(response.data);
            setErrorMessage('');
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setFoundUser(null);
            setErrorMessage('Пользователь с таким email не найден');
        }
    };

    const resetModal = () => {
        setEmail('');
        setFoundUser(null);
        setErrorMessage('');
        setIsModalVisible(false);
    };

    const getAvatarUrl = (photo) => {
        return `http://localhost:9999/files/images/show?bucket=PROFILE&file=${photo}`;
    };

    return (
        <div className="friends-page">
            <Sidebar />
            <div className="friends-main-info">
                <div className="friends-upper-content">
                    <UpperMenu />
                </div>
                <div className="friends-main-content">
                    <h1 className="friends-title">Friends</h1>
                    <div className="friends-info">
                        <span className="friends-col">Все друзья: {friends.length}</span>
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>
                            Добавить друга
                        </Button>
                    </div>
                    <ul className="friends-list">
                        {friends.map((friend) => {
                            const friendUser = friend.sender.userId === currentUser ? friend.receiver : friend.sender;
                            return (
                                <li key={friend.friendshipId} className="friends-item"
                                    onClick={() => handleVisitFriendProfile(friend.friendshipId, friendUser)}>
                                    <img src={friendUser.photo ? getAvatarUrl(friendUser.photo) : null}
                                         alt={friendUser.firstName} className="friends-avatar"/>
                                    <div className="friends-name">
                                        <span>{friendUser.firstName} {friendUser.lastName}</span>
                                    </div>
                                    <div className="friends-actions">
                                        <Button type="link" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFriend(friend.friendshipId);
                                        }}>
                                            Удалить
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {isModalVisible && (
                <div className="friends-modal-overlay">
                    <Modal
                        title="Поиск друга"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={resetModal}
                        style={{font: "16px 'GOST Type A', cursive"}}
                    >
                        <div className="friends-modal-containers" style={{display: 'flex', alignItems: 'center'}}>
                            <Input
                                placeholder="E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                                size="large"
                                style={{marginRight: '10px'}}
                            />
                            <Button onClick={handleSearchUser} icon={<SearchOutlined/>}/>
                        </div>
                        {errorMessage && <div style={{color: 'red', marginTop: '10px'}}>{errorMessage}</div>}
                        {foundUser && (
                            <>
                                <div className="found-user"
                                     style={{marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                                    <img src={foundUser.photo ? getAvatarUrl(foundUser.photo) : null} alt={foundUser.firstName} className="friends-avatar" />
                                    <div>
                                        <span>{foundUser.firstName} {foundUser.lastName}</span>
                                    </div>
                                </div>
                                <Button
                                    style={{ marginTop: '20px' }}
                                    onClick={handleAddFriend}
                                    disabled={!foundUser}
                                >
                                    Добавить
                                </Button>
                            </>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Friends;