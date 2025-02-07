// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Progress} from 'antd';
import './styles.css';
import UpperMenu from "../UpperMenu/UpperMenu.jsx";
import axios from "axios";

const icons = {
    grammar: 'src/components/MainRight/images/pen.png',
    reading: 'src/components/MainRight/images/book.png',
    listening: 'src/components/MainRight/images/audio.png'
};

const getProgressColor = (icon) => {
    switch (icon) {
        case 'grammar':
            return '#5E81F4';
        case 'reading':
            return '#0CC3E7';
        case 'listening':
            return '#FFAE33';
        default:
            return '#D9D9D9';
    }
};

const MainRight = () => {

    const [progressItems, setProgressItems] = useState([]);
    const [activityItems, setActivityItems] = useState([]);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {

                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                const readingResponse = await axios.get('http://localhost:8086/statistics/book-progress/percent', config);
                const grammarResponse = await axios.get('http://localhost:8086/statistics/testing-progress/percent?type=GRAMMAR', config);
                const listeningResponse = await axios.get('http://localhost:8086/statistics/testing-progress/percent?type=LISTENING', config);

                const newProgressItems = [
                    {icon: 'grammar', title: 'Grammar', subtext: 'Advanced', percent: grammarResponse.data},
                    {icon: 'reading', title: 'Reading', subtext: 'Intermediate', percent: readingResponse.data},
                    {icon: 'listening', title: 'Listening', subtext: 'Beginner', percent: listeningResponse.data}
                ];

                setProgressItems(newProgressItems);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                if (error.response && error.response.status === 401) {
                    // Обработка ошибки 401 (Unauthorized) - например, перенаправление на страницу авторизации
                    // window.location.href = '/auth'; // Замените '/auth' на путь к вашей странице авторизации
                }
            }
        };

        // Пример получения данных для activityItems (ЗАМЕНИТЬ ДАННЫМИ ИЗ ВАШЕГО API)
        const fetchActivityData = async () => {
            try {
                // Здесь нужно заменить на вызов вашего API, который возвращает данные об активности
                // Пример: const activityResponse = await axios.get('http://ваш-api/activity');
                // Предположим, что API возвращает массив объектов с полями icon, title, subtext

                // Пока используем статические данные, чтобы не было ошибок
                const staticActivityData = [
                    {icon: 'grammar', title: 'Grammar - Present simple', subtext: '27 Oct 2020, Tuesday'},
                    {icon: 'reading', title: 'Reading - Past simple', subtext: '28 Oct 2020, Wednesday'},
                    {icon: 'listening', title: 'Listening - Future simple', subtext: '29 Oct 2020, Thursday'}
                ];

                setActivityItems(staticActivityData); // Замените на activityResponse.data, если API возвращает данные
            } catch (error) {
                console.error('Ошибка при получении данных об активности:', error);
            }
        };

        fetchProgressData();
        fetchActivityData();
    }, []);

    return (
        <div className="main-right-container">
            <div className="main-right-clone"/>
            <div className="main-right">
                <UpperMenu/>
                <div className="progress-section">
                    <h3>Прогресс</h3>
                    <div className="progress-items">
                        {progressItems.map((item, index) => (
                            <div key={index} className="progress-item">
                                <img
                                    className={item.icon}
                                    src={icons[item.icon]}
                                    alt={item.title}
                                />
                                <div className="progress-info">
                                    <span>{item.title}</span>
                                    <span className="subtext">{item.subtext}</span>
                                </div>
                                <Progress
                                    percent={item.percent}
                                    showInfo={false}
                                    strokeColor={getProgressColor(item.icon)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="activity-section">
                    <h3>Последняя активность</h3>
                    <div className="activity-items">
                        {activityItems.map((item, index) => (
                            <div key={index} className="activity-item">
                                <img
                                    className={item.icon}
                                    src={icons[item.icon]}
                                    alt={item.title}
                                />
                                <div className="activity-info">
                                    <span>{item.title}</span>
                                    <span className="subtext">{item.subtext}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainRight;