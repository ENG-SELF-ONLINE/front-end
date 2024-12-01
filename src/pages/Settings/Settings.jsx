// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import avatar from "./images/avatar.png";
import visible from "./images/visible.png";
import {Button, Switch} from "antd";

const Settings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        login: "user123",
        password: "password123",
        firstName: "Иван",
        lastName: "Иванов",
        emailNotifications: true, // Заглушка для уведомлений
    });

    const handleChangePhoto = () => {
        console.log("Изменить фото");
    };

    const handleChangePassword = () => {
        console.log("Изменить пароль");
    };

    const handleSave = () => {
        console.log("SAVE");
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
            [id]: value, // Обновляем поле с id, которое соответствует полю ввода
        }));
    };

    return (
        <div className="settings-page">
            <Sidebar/>
            <div className="settings-main-info">
                <div className="settings-upper-content">
                    <UpperMenu/>
                </div>
                <div className="settings-main-content">
                    <h1 className="settings-title">Settings</h1>
                    <div className="user-profile-card">
                        <div className="user-info">
                            <div className="user-photo-block">
                                <img src={avatar} alt="Аватар"/>
                                <a href="/change-photo" onClick={handleChangePhoto} className="change-photo">
                                    Изменить фото
                                </a>
                            </div>
                            <div className="user-data">
                                <div className="first-line">
                                    <div className="user-data-item">
                                        <label htmlFor="login">E-mail</label>
                                        <input
                                            type="text"
                                            id="login"
                                            value={userData.login}
                                            readOnly // Делаем поле только для чтения
                                        />
                                        <div className="notification-block">
                                            <p className="notification-title">
                                                Уведомления на почту:
                                            </p>
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
                                            onChange={handleInputChange} // Добавьте обработчик изменения
                                        />
                                    </div>
                                </div>
                                <div className="second-line">
                                    <div className="password-data-item">
                                        <div className="password-data">
                                            <label htmlFor="password">Пароль</label>
                                            <div className="password-block">
                                                <input
                                                    type={showPassword ? "text" : "password"} // Показывает пароль, если showPassword
                                                    id="password"
                                                    value={userData.password}
                                                    readOnly
                                                />
                                                <div className="password-visible" type={'button'}
                                                     onClick={handleShowPassword}>
                                                    <img src={visible} alt="Показать/Скрыть пароль"/>
                                                </div>
                                            </div>
                                            <a href="/change-password" onClick={handleChangePassword}
                                               className="change-password">
                                                Изменить пароль
                                            </a>
                                        </div>
                                    </div>
                                    <div className="user-data-item">
                                        <label htmlFor="lastName">Фамилия</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={userData.lastName}
                                            onChange={handleInputChange} // Добавьте обработчик изменения
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
        </div>
    );
};

export default Settings;