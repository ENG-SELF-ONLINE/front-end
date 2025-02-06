// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, Input, message} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import './styles.css';
import axios from 'axios';

const AuthPage = () => {
    const [isRegistration, setIsRegistration] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // Для авторизации
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsRegistration(!isRegistration);
    };

    useEffect(() => {
        if (!isRegistration) {
            setEmail('');
            setPassword('');
            setFirstname('');
            setLastname('');
            setImage(null);
        } else {
            setUsername('');
            setPassword('');
        }
    }, [isRegistration]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8888/login', {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                const token = response.data.access_token;
                localStorage.setItem('accessToken', token);
                navigate('/statistics');
                message.success('Успешная авторизация!');
            } else {
                message.error('Неверные учетные данные.');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            message.error('Ошибка авторизации.');
        }
    };

    const handleRegister = async () => {
        try {
            const formData = new FormData();
            formData.append('userDTO', new Blob([JSON.stringify({
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            })], {
                type: "application/json"
            }));

            formData.append('image', image);

            const response = await axios.post('http://localhost:8888/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                message.success('Регистрация прошла успешно! Теперь войдите.');
                setIsRegistration(false);
            } else {
                message.error('Ошибка регистрации.');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            message.error('Ошибка регистрации: ' + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleForgotPassword = () => {
        console.log('Забыли пароль');
    };

    const renderSwitchLinks = () => {
        if (!isRegistration) {
            return (
                <>
                    <Link to="#" onClick={handleToggle} className="auth-switch">
                        Нет аккаунта? Зарегистрируйся!
                    </Link>
                    <Link to="/forgot-password" onClick={handleForgotPassword} className="auth-switch">
                        Забыли пароль?
                    </Link>
                </>
            );
        } else {
            return (
                <Link onClick={() => setIsRegistration(false)} className="auth-switch" to="#">
                    Вернуться к авторизации
                </Link>
            );
        }
    };

    return (
        <>
            <div className="auth-container">
                <img src="src/pages/AuthPage/images/logo.png" alt="Logo" className="logo"/>
                <div className="auth-block">
                    <h2 className="auth-title">
                        {isRegistration ? 'Регистрация' : 'Авторизация'}
                    </h2>
                    <div className="auth-form">
                        {!isRegistration && (
                            <>
                                <div className="auth-field">
                                    <span className="auth-label">Username:</span>
                                    <Input
                                        id="username"
                                        placeholder="Username"
                                        className="auth-input"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <span className="auth-label">Пароль:</span>
                                    <Input.Password
                                        id="password"
                                        placeholder="Password"
                                        className="auth-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {isRegistration && (
                            <>
                                <div className="auth-field">
                                    <span className="auth-label">Email:</span>
                                    <Input
                                        id="email"
                                        placeholder="Email"
                                        className="auth-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <span className="auth-label">Пароль:</span>
                                    <Input.Password
                                        id="password"
                                        placeholder="Password"
                                        className="auth-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <span className="auth-label">Имя:</span>
                                    <Input
                                        id="firstname"
                                        placeholder="First Name"
                                        className="auth-input"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <span className="auth-label">Фамилия:</span>
                                    <Input
                                        id="lastname"
                                        placeholder="Last Name"
                                        className="auth-input"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field image-upload-container">
                                    <span className="auth-label">Фотография:</span>
                                    <label htmlFor="image-upload" className="image-upload-circle">
                                        {image ? (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                        ) : (
                                            <div className="upload-icon">
                                                +
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{display: 'none'}}
                                    />
                                </div>
                            </>
                        )}
                        <div className="auth-button-container">
                            <Button
                                type="primary"
                                className="auth-button"
                                onClick={isRegistration ? handleRegister : handleLogin}>
                                {isRegistration ? 'Зарегистрироваться' : 'Войти'}
                            </Button>
                        </div>
                        <div className="auth-switch-container">{renderSwitchLinks()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;