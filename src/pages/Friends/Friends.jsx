// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import { Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Friends = () => {
    const [friends, setFriends] = useState([
        { id: 1, name: 'John', surname: 'Doe', avatar: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Jane', surname: 'Doe', avatar: 'https://via.placeholder.com/150' },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // Добавляем состояние для сообщения об ошибке

    const handleAddFriend = () => {
        if (foundUser) {
            setFriends([...friends, foundUser]);
            resetModal();
        }
    };

    const handleDeleteFriend = (friendId) => {
        setFriends(friends.filter((friend) => friend.id !== friendId));
    };

    const handleSearchUser = () => {
        const users = [
            {
                id: 3,
                name: 'Alice',
                surname: 'Smith',
                avatar: 'https://via.placeholder.com/150',
                email: 'alice@example.com'
            },
            {
                id: 4,
                name: 'Bob',
                surname: 'Johnson',
                avatar: 'https://via.placeholder.com/150',
                email: 'bob@example.com'
            },
        ];

        const user = users.find(user => user.email === email);
        if (user) {
            setFoundUser(user);
            setErrorMessage(''); // Очищаем сообщение об ошибке
        } else {
            setFoundUser(null);
            setErrorMessage('Пользователь с таким email не найден'); // Устанавливаем сообщение об ошибке
        }
    };

    const resetModal = () => {
        setEmail('');
        setFoundUser(null);
        setErrorMessage('');
        setIsModalVisible(false);
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
                        {friends.map((friend) => (
                            <li key={friend.id} className="friends-item">
                                <img src={friend.avatar} alt={friend.name} className="friends-avatar" />
                                <div className="friends-name">
                                    <span>{friend.name} {friend.surname}</span>
                                </div>
                                <div className="friends-actions">
                                    <Button type="link" onClick={() => handleDeleteFriend(friend.id)}>
                                        Удалить
                                    </Button>
                                </div>
                            </li>
                        ))}
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
                        style={{ font: "16px 'GOST Type A', cursive" }}
                    >
                        <div className="friends-modal-containers" style={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                placeholder="E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                                size="large"
                                style={{ marginRight: '10px' }}
                            />
                            <Button onClick={handleSearchUser} icon={<SearchOutlined />} />
                        </div>
                        {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>} {/* Отображаем сообщение об ошибке */}
                        {foundUser && (
                            <>
                                <div className="found-user" style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                                    <img src={foundUser.avatar} alt={foundUser.name} className="friends-avatar" />
                                    <div>
                                        <span>{foundUser.name} {foundUser.surname}</span>
                                    </div>
                                </div>
                                <Button
                                    style={{ marginTop: '20px' }}
                                    onClick={handleAddFriend}
                                    disabled={!foundUser} // Деактивируем кнопку, если пользователь не выбран
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