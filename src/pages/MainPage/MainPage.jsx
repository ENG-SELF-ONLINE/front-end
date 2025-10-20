// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css';
import MainRight from "../../components/MainRight/MainRight.jsx";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {Bar, Doughnut} from 'react-chartjs-2';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from "../../setupAxiosInterceptors.jsx";

ChartJS.register(
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const MainPage = () => {
    const [weekData, setWeekData] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [wordData, setWordData] = useState(null);
    const [learnData, setLearnData] = useState(null);
    const [activeWeek, setActiveWeek] = useState(0);

    useEffect(() => {
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
                    `http://localhost:8086/statistics/activity?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
                    config
                );

                const apiData = response.data;
                console.log('API Data:', apiData);

                if (apiData) {
                    const transformedWeekData = transformActivitiesData(apiData.activities);
                    setWeekData(transformedWeekData);
                    setTotalTime(apiData.totalTime);

                    setWordData({
                        newWords: apiData.deckStatisticsDTO.newWords,
                        learnedWords: apiData.deckStatisticsDTO.learningWords,
                        removedWords: apiData.deckStatisticsDTO.repeatingWords
                    });

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

        fetchWeekData();
    }, [activeWeek]);

    const resetData = () => {
        setWeekData(null);
        setTotalTime(0);
        setWordData(null);
        setLearnData(null);
    };

    const formatTime = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours} ч ${minutes} мин`;
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
            return date.toLocaleDateString('ru-RU', { weekday: 'short' });
        };

        const daysOfWeek = {
            'пн': 0,
            'вт': 1,
            'ср': 2,
            'чт': 3,
            'пт': 4,
            'сб': 5,
            'вс': 6
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

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek - 1));
    };

    const handleNextWeek = async () => {
        setActiveWeek(prevWeek => prevWeek + 1);
    };

    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Чтение',
                data: weekData ? weekData.reading : new Array(7).fill(0),
                backgroundColor: '#0CC3E7',
                stack: 'Stack 0',
            },
            {
                label: 'Аудирование',
                data: weekData ? weekData.listening : new Array(7).fill(0),
                backgroundColor: '#FFAE33',
                stack: 'Stack 0',
            },
            {
                label: 'Грамматика',
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
                    text: 'Часы',
                },
            },
        },
        elements: {
            bar: {
                borderWidth: 1,
            }
        }
    };

    const doughnutData = {
        labels: ['Новые слова', 'Изучаемые слова', 'Изученные слова'],
        datasets: [
            {
                data: wordData ? [wordData.newWords, wordData.learnedWords, wordData.removedWords] : [0, 0, 0],
                backgroundColor: [
                    '#F5D76E',
                    '#A8D08D',
                    '#E5989B',
                ],
                borderColor: [
                    '#F5D76E',
                    '#A8D08D',
                    '#E5989B',
                ],
                borderWidth: 1,
            },
        ],
    };

    const mainData = {
        labels: ['Чтение', 'Аудирование', 'Грамматика'],
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
                text: 'Статистика обучения',
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Статистика изучения слов',
            },
        },
    };

    return (
        <div className="main-container">
            <Sidebar/>
            <div className="main-page">
                <div className="center-content">
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
                                <span>Чтение:</span>
                                <span>{learnData ? formatTime(learnData.reading.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
                            </div>
                            <div className="main-item">
                                <span>Аудирование:</span>
                                <span>{learnData ? formatTime(learnData.listening.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
                            </div>
                            <div className="main-item">
                                <span>Грамматика:</span>
                                <span>{learnData ? formatTime(learnData.grammar.reduce((sum, value) => sum + value, 0)) : '0 ч 0 мин'}</span>
                            </div>
                        </div>
                        <div className="main-chart">
                            <Doughnut data={mainData} options={mainOptions}/>
                        </div>
                    </div>
                    <div className="word-stats">
                        <div className="word-list">
                            <div className="word-item">
                                <span>Новые слова:</span>
                                <span>{wordData ? wordData.newWords : 0}</span>
                            </div>
                            <div className="word-item">
                                <span>Изучаемые слова:</span>
                                <span>{wordData ? wordData.learnedWords : 0}</span>
                            </div>
                            <div className="word-item">
                                <span>Изученные слова:</span>
                                <span>{wordData ? wordData.removedWords : 0}</span>
                            </div>
                        </div>
                        <div className="word-chart">
                            <Doughnut data={doughnutData} options={doughnutOptions}/>
                        </div>
                    </div>
                </div>
            </div>
            <MainRight/>
        </div>
    );
};

export default MainPage;