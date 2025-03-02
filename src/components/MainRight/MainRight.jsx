// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Progress} from 'antd';
import './styles.css';
import UpperMenu from "../UpperMenu/UpperMenu.jsx";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

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

                const readingResponse = await axiosInstance.get('http://localhost:8086/statistics/book-progress/percent', config);
                const grammarResponse = await axiosInstance.get('http://localhost:8086/statistics/testing-progress/percent?type=GRAMMAR', config);
                const listeningResponse = await axiosInstance.get('http://localhost:8086/statistics/testing-progress/percent?type=LISTENING', config);

                const newProgressItems = [
                    {icon: 'grammar', title: 'Grammar', subtext: 'Advanced', percent: grammarResponse.data},
                    {icon: 'reading', title: 'Reading', subtext: 'Intermediate', percent: readingResponse.data},
                    {icon: 'listening', title: 'Listening', subtext: 'Beginner', percent: listeningResponse.data}
                ];

                setProgressItems(newProgressItems);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        const fetchActivityData = async () => {
            try {
                const activityResponse = await axiosInstance.get('http://localhost:8085/trackers/activities');

                const formattedActivityData = activityResponse.data.map(activity => {

                    const formattedType = activity.activityType.charAt(0) + activity.activityType.slice(1).toLowerCase();

                    const date = new Date(activity.activityDate);
                    const day = date.getDate();
                    const month = date.toLocaleString('en-GB', { month: 'short' });
                    const year = date.getFullYear();
                    const weekday = date.toLocaleString('en-GB', { weekday: 'long' });

                    const formattedDate = `${day} ${month} ${year}, ${weekday}`;

                    return {
                        icon: activity.activityType.toLowerCase(),
                        title: `${formattedType} - ${activity.activityTitle}`,
                        subtext: formattedDate
                    };
                });

                setActivityItems(formattedActivityData);
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