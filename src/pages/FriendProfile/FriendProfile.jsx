// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {Button, Progress} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Bar, Doughnut} from "react-chartjs-2";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const FriendProfile = () => {
    const [activeWeek, setActiveWeek] = useState(0);
    const [weekData, setWeekData] = useState(null);
    const [learnData, setLearnData] = useState(null);
    const [totalTime, setTotalTime] = useState(null);
    const [friendData, setFriendData] = useState(null);
    const location = useLocation();
    const {friendId} = useParams();
    const [nextLevel, setNextLevel] = useState(null);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const navigate = useNavigate();

    const getAccessToken = () => {
        return localStorage.getItem('accessToken');
    };

    const formatTime = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours} ч ${minutes} мин`;
    };

    const handleDeleteFriend = async () => {
        const token = getAccessToken();
        try {
            let response = await axiosInstance.delete(`http://localhost:8084/friendships/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response)
            navigate(`/friends`);
        } catch (error) {
            console.error("Error deleting friend", error);
        }
    };

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek - 1));
    };

    const handleNextWeek = async () => {
        setActiveWeek(prevWeek => prevWeek + 1);
    };

    useEffect(() => {
        if (location.state?.user) {
            setFriendData(location.state.user);
        }
    }, [location.state]);

    useEffect(() => {
        if (!friendData) return;

        const fetchWeekData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                const startDate = getStartDateForWeek(activeWeek);
                const endDate = getEndDateForWeek(activeWeek);

                const formattedStartDate = startDate.toISOString();
                const formattedEndDate = endDate.toISOString();

                console.log('Fetching data for week:', activeWeek);
                console.log('Start Date:', formattedStartDate);
                console.log('End Date:', formattedEndDate);

                const response = await axiosInstance.get(
                    `http://localhost:8086/statistics/activity?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${friendData.userId}`,
                    config
                );

                const apiData = response.data;
                console.log('API Data:', apiData);

                if (apiData) {
                    const transformedWeekData = transformActivitiesData(apiData.activities);
                    setWeekData(transformedWeekData);
                    setTotalTime(apiData.totalTime);

                    setLearnData({
                        reading: transformedWeekData.reading,
                        listening: transformedWeekData.listening,
                        grammar: transformedWeekData.grammar,
                        totalWords: apiData.deckStatisticsDTO.totalWords,
                        newWords: apiData.deckStatisticsDTO.newWords,
                        learningWords: apiData.deckStatisticsDTO.learningWords,
                        repeatingWords: apiData.deckStatisticsDTO.repeatingWords
                    });

                } else {
                    resetData();
                }

            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                resetData();
            }
        };

        const fetchNextLevel = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get(`http://localhost:8084/users/next-level?friendId=${friendData.userId}`, config);
                setNextLevel(response.data);
            } catch (error) {
                console.error('Ошибка при получении следующего уровня:', error);
            }
        };

        const fetchProgressPercentage = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };
                const response = await axiosInstance.get(`http://localhost:8086/statistics/common-progress/percent?userId=${friendData.userId}`, config);
                setProgressPercentage(response.data);
            } catch (error) {
                console.error('Ошибка при получении процента прогресса:', error);
            }
        };

        fetchNextLevel();
        fetchProgressPercentage();
        fetchWeekData();
    }, [activeWeek, friendData]);

    const resetData = () => {
        setWeekData(null);
        setTotalTime(0);
        setLearnData(null);
    };

    const getStartDateForWeek = (weekNumber) => {
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

        const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff + (weekNumber * 7)));
        startDate.setUTCHours(0, 0, 0, 0);
        return startDate;
    };

    const getEndDateForWeek = (weekNumber) => {
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

        const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff + 6 + (weekNumber * 7)));
        endDate.setUTCHours(23, 59, 59, 999);
        return endDate;
    };

    const transformActivitiesData = (activitiesMap) => {
        const transformedData = {
            reading: new Array(7).fill(0),
            listening: new Array(7).fill(0),
            grammar: new Array(7).fill(0)
        };

        const getDayOfWeek = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {weekday: 'short'});
        };

        const daysOfWeek = {
            'Mon': 0,
            'Tue': 1,
            'Wed': 2,
            'Thu': 3,
            'Fri': 4,
            'Sat': 5,
            'Sun': 6
        };

        for (const activityType in activitiesMap) {
            activitiesMap[activityType].forEach(activity => {
                const dayOfWeek = getDayOfWeek(activity.date);
                const dayIndex = daysOfWeek[dayOfWeek];

                if (dayIndex !== undefined) {
                    transformedData[activityType][dayIndex] = (transformedData[activityType][dayIndex] || 0) + (activity.value / 60);
                }
            });
        }

        return transformedData;
    };

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Reading',
                data: weekData ? weekData.reading : new Array(7).fill(0),
                backgroundColor: '#0CC3E7',
                stack: 'Stack 0',
            },
            {
                label: 'Listening',
                data: weekData ? weekData.listening : new Array(7).fill(0),
                backgroundColor: '#FFAE33',
                stack: 'Stack 0',
            },
            {
                label: 'Grammar',
                data: weekData ? weekData.grammar : new Array(7).fill(0),
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
                text: `Недельная активность (${getStartDateForWeek(activeWeek).toLocaleDateString()} - ${getEndDateForWeek(activeWeek).toLocaleDateString()}) - ${formatTime(totalTime)}`,
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
                data: weekData ? [
                    (weekData.reading.reduce((sum, value) => sum + value, 0)) || 0,
                    (weekData.listening.reduce((sum, value) => sum + value, 0)) || 0,
                    (weekData.grammar.reduce((sum, value) => sum + value, 0)) || 0
                ] : [0, 0, 0],
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

    const getAvatarUrl = (photo) => {
        return `http://localhost:9999/files/images/show?bucket=PROFILE&file=${photo}`;
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
                            {friendData.firstName + " " + friendData.lastName}
                            <Button type="link" onClick={handleDeleteFriend}>
                                Удалить
                            </Button>
                        </span>
                    )}
                    <div className="friend-profile-content">
                        <div className="friend-profile-left">
                            <img style={{height: '235px', width: '200px', borderRadius: '30px'}}
                                 src={friendData && friendData.photo ? getAvatarUrl(friendData.photo) : null}
                                 alt="Аватар"/>
                            <div className="level-container" style={{paddingLeft: '0px'}}>
                                <span className="level">{friendData?.level}</span>
                                <div className="progress-bar">
                                    <Progress percent={progressPercentage} showInfo={false}/>
                                </div>
                                {friendData && <span className="level">{nextLevel}</span>}
                            </div>
                        </div>
                        <div className="friend-profile-right">
                            <div className="week-nav">
                                <button className={`prev-week`} onClick={handlePrevWeek}>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </button>
                                <div className="chart-container">
                                    <Bar data={data} options={options}/>
                                </div>
                                <button
                                    className={`next-week`} onClick={handleNextWeek} disabled={activeWeek === 0}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </button>
                            </div>
                            <div className="main-stats">
                                <div className="main-list">
                                    <div className="main-item">
                                        <span>Reading:</span>
                                        <span>{learnData ? formatTime(learnData.reading.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
                                    </div>
                                    <div className="main-item">
                                        <span>Listening:</span>
                                        <span>{learnData ? formatTime(learnData.listening.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
                                    </div>
                                    <div className="main-item">
                                        <span>Grammar:</span>
                                        <span>{learnData ? formatTime(learnData.grammar.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
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