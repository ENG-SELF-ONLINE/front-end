// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './styles.css';
import avatar from "./images/avatar.png";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import { Button, Progress } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut } from "react-chartjs-2";

const FriendProfile = () => {
    const [activeWeek, setActiveWeek] = useState(0);
    const [weekData, setWeekData] = useState(null);
    const [learnData, setLearnData] = useState(null);
    const [totalTime, setTotalTime] = useState(null);
    const [friendData, setFriendData] = useState(null); // Данные о друге
    const [hasNextWeekData, setHasNextWeekData] = useState(true);

    const handleDeleteFriend = () => {
        console.log("handleDelete Friend");
    };

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek > 0 ? prevWeek - 1 : 0));
    };

    const handleNextWeek = () => {
        if(hasNextWeekData) {
            setActiveWeek(prevWeek => prevWeek + 1);
        }
    };

    useEffect(() => {
        // Функция для получения данных о друге
        const fetchFriendData = async () => {
            // Здесь будет запрос к бэкэнду, который должен вернуть данные о друге
            // Например, fetch('/api/friend/1')

            // Заглушка:
            const mockFriendData = {
                name: "Дмитрий Кишко",
                level: "A1",
                avatar: avatar, // Путь к аватару
            };

            setFriendData(mockFriendData);
        };

        fetchFriendData();
    }, []);

    useEffect(() => {
        const fetchWeekData = async () => {
            const mockDataSets = [
                {
                    reading: [2, 4, 3, 1, 5, 2, 1],
                    listening: [1, 3, 2, 4, 1, 3, 2],
                    practice: [3, 1, 4, 2, 2, 1, 3],
                    totalTime: 15,
                    newWords: 20,
                    learnedWords: 35,
                    removedWords: 5
                },
                {
                    reading: [3, 2, 1, 4, 0, 2, 3],
                    listening: [0, 1, 1, 0, 1, 0, 0],
                    practice: [2, 2, 2, 2, 2, 2, 2],
                    totalTime: 10,
                    newWords: 10,
                    learnedWords: 20,
                    removedWords: 2
                },
            ];

            const selectedData = mockDataSets[activeWeek];
            if (selectedData) {
                const totalTime = selectedData.reading.reduce((sum, value) => sum + value, 0) +
                    selectedData.listening.reduce((sum, value) => sum + value, 0) +
                    selectedData.practice.reduce((sum, value) => sum + value, 0);

                setWeekData(selectedData);
                setTotalTime(totalTime);
                setLearnData(selectedData);
                setHasNextWeekData(mockDataSets[activeWeek + 1] !== undefined); // Проверяем, есть ли данные для следующей недели
            } else {
                // Если данных нет, обнуляем все состояния
                setWeekData(null);
                setTotalTime(null);
                setLearnData(null);
                setHasNextWeekData(false); // Нет данных для следующей недели
            }
        };

        fetchWeekData();
    }, [activeWeek]);

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Reading',
                data: weekData ? weekData.reading : [], // Используем данные из weekData
                backgroundColor: '#0CC3E7',
                stack: 'Stack 0',
            },
            {
                label: 'Listening',
                data: weekData ? weekData.listening : [],
                backgroundColor: '#FFAE33',
                stack: 'Stack 0',
            },
            {
                label: 'Practice',
                data: weekData ? weekData.practice : [],
                backgroundColor: '#5E81F4',
                stack: 'Stack 0',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Недельная активность - ${totalTime} hours`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hours',
                },
            },
        },
        elements: {
            bar: {
                borderWidth: 1,
            }
        }
    };

    const mainData = {
        labels: ['Reading', 'Listening', 'Grammar'],
        datasets: [
            {
                data: weekData ? [weekData.reading.reduce((sum, value) => sum + value, 0),
                    weekData.listening.reduce((sum, value) => sum + value, 0),
                    weekData.practice.reduce((sum, value) => sum + value, 0)] : [0, 0, 0],
                backgroundColor: [
                    '#0CC3E7',
                    '#FFAE33',
                    '#5E81F4',
                ],
                borderColor: [
                    '#0CC3E7',
                    '#FFAE33',
                    '#5E81F4',
                ],
                borderWidth: 1,
            },
        ],
    };

    const mainOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Learn Statistics',
            },
        },
    };

    return (
        <div className="friend-profile-page">
            <Sidebar/>
            <div className="friend-profile-main-info">
                <div className="friend-profile-upper-content">
                    <UpperMenu/>
                </div>
                <div className="friend-profile-main-content">
                    <h1 className="friend-profile-title">Profile</h1>
                    {friendData && (
                        <span style={{
                            display: 'flex',
                            marginTop: '30px',
                            marginBottom: '30px',
                            fontFamily: 'cursive',
                            fontSize: '20px',
                            alignItems: 'center'
                        }}>
                            {friendData.name}
                            <Button type="link" onClick={handleDeleteFriend}>
                                Удалить
                            </Button>
                        </span>
                    )}
                    <div className="friend-profile-content">
                        <div className="friend-profile-left">
                            <img style={{height: '235px', width: '200px', borderRadius: '30px'}} src={friendData?.avatar} alt="Аватар"/>
                            <div className="level-container" style={{paddingLeft: '0px'}}>
                                <span className="level">{friendData?.level}</span>
                                <div className="progress-bar">
                                    <Progress percent={50} showInfo={false}/>
                                </div>
                                <span className="level">A2</span>
                            </div>
                        </div>
                        <div className="friend-profile-right">
                            <div className="week-nav">
                                <button className={`prev-week ${activeWeek === 0 ? 'disabled' : ''}`}
                                        onClick={handlePrevWeek} disabled={activeWeek === 0}>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </button>
                                <div className="chart-container">
                                    <Bar data={data} options={options}/>
                                </div>
                                <button className={`next-week ${!hasNextWeekData ? 'disabled' : ''}`}
                                        onClick={handleNextWeek} disabled={!hasNextWeekData}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </button>
                            </div>
                            <div className="main-stats">
                                <div className="main-list">
                                    <div className="main-item">
                                        <span>Reading:</span>
                                        <span>{learnData ? learnData.reading.reduce((sum, value) => sum + value, 0) : 0}</span>
                                    </div>
                                    <div className="main-item">
                                        <span>Listening:</span>
                                        <span>{learnData ? learnData.listening.reduce((sum, value) => sum + value, 0) : 0}</span>
                                    </div>
                                    <div className="main-item">
                                        <span>Grammar:</span>
                                        <span>{learnData ? learnData.practice.reduce((sum, value) => sum + value, 0) : 0}</span>
                                    </div>
                                </div>
                                <div className="main-chart">
                                    <Doughnut data={mainData} options={mainOptions}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendProfile;