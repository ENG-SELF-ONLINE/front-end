// eslint-disable-next-line no-unused-vars
import React, {useEffect, useRef, useState} from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import visible from "./images/visible.png";
import {Button, Input, Modal, Switch} from "antd";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const Settings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [tempPhoto, setTempPhoto] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef(null);
    const accessToken = localStorage.getItem('accessToken');

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=PROFILE&file=${coverImage}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:8084/users/api', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserData(response.data);
                setPhoto(getCoverImageUrl(response.data.photo));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [accessToken]);

    const handleChangePhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setTempPhoto(imageUrl);
            setPhoto(file);
            setHasChanges(true); // Фото изменено
        } else {
            setTempPhoto(null);
        }
    };

    const handleChangePassword = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await axiosInstance.put('http://localhost:8084/users/api', {
                ...userData,
                password: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setNewPassword('');
            setIsModalVisible(false);
            const updatedUserData = await axiosInstance.get('http://localhost:8084/users/api', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setUserData(updatedUserData.data);
            setHasChanges(true);
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        try {
            await axiosInstance.put('http://localhost:8084/users/api', userData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (tempPhoto) {
                const formData = new FormData();
                formData.append("image", photo);
                await axiosInstance.post('http://localhost:8084/users/api/photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }

            window.location.reload();
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleToggleNotifications = () => {
        setUserData((prevData) => ({
            ...prevData,
            emailNotifications: !prevData.emailNotifications,
        }));
        setHasChanges(true); // Изменения в уведомлениях
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    if (!photo || !userData) {
        return <div></div>;
    }

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        setHasChanges(true); // Поля изменены
    };

    const handleChangePhotoClick = () => {
        fileInputRef.current.click();
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
                                <img style={{height: '235px', width: '200px', borderRadius: '30px'}}
                                     src={tempPhoto || photo} alt="Аватар"/>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangePhoto}
                                    className="change-photo-input"
                                    ref={fileInputRef}
                                    style={{display: 'none'}}
                                />
                                <span
                                    className="change-photo"
                                    onClick={handleChangePhotoClick}
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
                                            value={userData.email}
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
                                                    <img src={visible} alt="Показать/Скрыть пароль"/>
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
                            <Button
                                className="save-button-style"
                                onClick={handleSave}
                                disabled={!hasChanges}
                            >
                                Сохранить
                            </Button>
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
