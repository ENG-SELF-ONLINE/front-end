// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Button, Input} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import './styles.css';

const AuthPage = () => {
    const [isRegistration, setIsRegistration] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsRegistration(!isRegistration);
    };

    const handleLogin = () => {
        console.log('Авторизация');
        navigate('/statistics');
    };

    const handleRegister = () => {
        console.log('Регистрация');
        navigate('/profile');
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
                        <div className="auth-field">
                            <span className="auth-label">Логин:</span>
                            <Input
                                id="username"
                                placeholder="Email"
                                className="auth-input"
                            />
                        </div>
                        <div className="auth-field">
                            <span className="auth-label">Пароль:</span>
                            <Input.Password
                                id="password"
                                placeholder="Password"
                                className="auth-input"
                            />
                        </div>
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