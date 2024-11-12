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
    const [activeWeek, setActiveWeek] = useState(0);
    const [weekData, setWeekData] = useState(null); // Данные для текущей недели
    const [totalTime, setTotalTime] = useState(null); // Общее время за неделю
    const [wordData, setWordData] = useState(null); // Данные для круговой диаграммы слов
    const [learnData, setLearnData] = useState(null); // Данные для круговой диаграммы слов

    useEffect(() => {
        // Заглушка для запроса к бэкэнду
        const fetchWeekData = async () => {
            // Здесь будет запрос к бэкэнду, который должен вернуть данные по активной неделе
            // Например, fetch('/api/week-data?week=' + activeWeek)

            // Заглушка:
            const mockData = {
                reading: [2, 4, 3, 1, 5, 2, 1],
                listening: [1, 3, 2, 4, 1, 3, 2],
                practice: [3, 1, 4, 2, 2, 1, 3],
                totalTime: 15,
                newWords: 20,
                learnedWords: 35,
                removedWords: 5
            };

            const totalTime = mockData.reading.reduce((sum, value) => sum + value, 0) +
                mockData.listening.reduce((sum, value) => sum + value, 0) +
                mockData.practice.reduce((sum, value) => sum + value, 0);

            setWeekData(mockData);
            setTotalTime(totalTime);
            setWordData(mockData);
            setLearnData(mockData);
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

    const doughnutData = {
        labels: ['New Words', 'Learned Words', 'Removed Words'],
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

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Words Statistics',
            },
        },
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

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek > 0 ? prevWeek - 1 : 0));
    };

    const handleNextWeek = () => {
        setActiveWeek(prevWeek => prevWeek + 1);
    };

    return (
        <div className="main-container">
            <Sidebar/>
            <div className="main-page">
                <div className="center-content">
                    <div className="week-nav">
                        <button className={`prev-week ${activeWeek === 0 ? 'disabled' : ''}`} onClick={handlePrevWeek}
                                disabled={activeWeek === 0}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <div className="chart-container">
                            <Bar data={data} options={options}/>
                        </div>
                        <button className="next-week" onClick={handleNextWeek}>
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
                    <div className="word-stats">
                        <div className="word-list">
                            <div className="word-item">
                                <span>New Words:</span>
                                <span>{wordData ? wordData.newWords : 0}</span>
                            </div>
                            <div className="word-item">
                                <span>Learned Words:</span>
                                <span>{wordData ? wordData.learnedWords : 0}</span>
                            </div>
                            <div className="word-item">
                                <span>Removed Words:</span>
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