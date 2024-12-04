// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import avatar from "./images/avatar.png";
import visible from "./images/visible.png";
import { Button, Switch, Modal, Input } from "antd";

const Settings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        login: "user123",
        password: "password123",
        firstName: "Иван",
        lastName: "Иванов",
        emailNotifications: true,
    });
    const [newPassword, setNewPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [photo, setPhoto] = useState(avatar);
    const fileInputRef = useRef(null); // Создаем реф для input

    const handleChangePhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePassword = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setUserData((prevData) => ({
            ...prevData,
            password: newPassword,
        }));
        setNewPassword('');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = () => {
        console.log("SAVE", userData);
    };

    const handleToggleNotifications = () => {
        setUserData((prevData) => ({
            ...prevData,
            emailNotifications: !prevData.emailNotifications,
        }));
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleChangePhotoClick = () => {
        fileInputRef.current.click(); // Программно вызываем клик на input
    };

    return (
        <div className="settings-page">
            <Sidebar />
            <div className="settings-main-info">
                <div className="settings-upper-content">
                    <UpperMenu />
                </div>
                <div className="settings-main-content">
                    <h1 className="settings-title">Settings</h1>
                    <div className="user-profile-card">
                        <div className="user-info">
                            <div className="user-photo-block">
                                <img style={{height: '235px', width: '200px', borderRadius: '30px'}} src={photo} alt="Аватар" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangePhoto}
                                    className="change-photo-input"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }} // Скрываем input
                                />
                                <span
                                    className="change-photo"
                                    onClick={handleChangePhotoClick} // Добавляем обработчик клика
                                >
                                    Изменить фото
                                </span>
                            </div>
                            <div className="user-data">
                                <div className="first-line">
                                    <div className="user-data-item">
                                        <label htmlFor="login">E-mail</label>
                                        <input
                                            type="text"
                                            id="login"
                                            value={userData.login}
                                            readOnly
                                        />
                                        <div className="notification-block">
                                            <p className="notification-title">Уведомления на почту:</p>
                                            <Switch
                                                checked={userData.emailNotifications}
                                                onChange={handleToggleNotifications}
                                                id="emailNotifications"
                                                size='small'
                                            />
                                        </div>
                                    </div>
                                    <div className="user-data-item">
                                        <label htmlFor="firstName">Имя</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={userData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="second-line">
                                    <div className="password-data-item">
                                        <div className="password-data">
                                            <label htmlFor="password">Пароль</label>
                                            <div className="password-block">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    value={userData.password}
                                                    readOnly
                                                />
                                                <div className="password-visible" type={'button'}
                                                     onClick={handleShowPassword}>
                                                    <img src={visible} alt="Показать/Скрыть пароль" />
                                                </div>
                                            </div>
                                            <span onClick={handleChangePassword} className="change-password">
                                                Изменить пароль
                                            </span>
                                        </div>
                                    </div>
                                    <div className="user-data-item">
                                        <label htmlFor="lastName">Фамилия</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={userData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="save-button-container">
                            <Button className="save-button-style" onClick={handleSave}>Сохранить</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Изменить пароль" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input.Password
                    placeholder="Введите новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default Settings;