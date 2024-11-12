// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Progress} from 'antd';
import './styles.css';
import UpperMenu from "../UpperMenu/UpperMenu.jsx";

const icons = {
    grammar: 'src/components/MainRight/images/pen.png',
    reading: 'src/components/MainRight/images/book.png',
    listening: 'src/components/MainRight/images/audio.png'
};

const progressItems = [
    {icon: 'grammar', title: 'Grammar', subtext: 'Advanced', percent: 50},
    {icon: 'reading', title: 'Reading', subtext: 'Intermediate', percent: 30},
    {icon: 'listening', title: 'Listening', subtext: 'Beginner', percent: 70}
];

const activityItems = [
    {icon: 'grammar', title: 'Grammar - Present simple', subtext: '27 Oct 2020, Tuesday'},
    {icon: 'reading', title: 'Reading - Past simple', subtext: '28 Oct 2020, Wednesday'},
    {icon: 'listening', title: 'Listening - Future simple', subtext: '29 Oct 2020, Thursday'}
];

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