// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './styles.css';
import { Duration } from 'luxon';

const ActivityLog = () => {
    const initialActivities = () => [
        {
            id: 1,
            type: "reading",
            startTime: new Date(),
            endTime: moment().add(28 * 60 + 42, 'seconds').toDate(),
            duration: 1722,
        },
        {
            id: 2,
            type: "grammar",
            startTime: new Date(),
            endTime: moment().add(15 * 60 + 30, 'seconds').toDate(),
            duration: 930,
        },
        {
            id: 3,
            type: "listening",
            startTime: new Date(),
            endTime: moment().add(10 * 60, 'seconds').toDate(),
            duration: 600,
        },
    ];

    const [activities, setActivities] = useState(() => {
        const savedActivities = localStorage.getItem('activities');
        return savedActivities ? JSON.parse(savedActivities) : initialActivities();
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(activities)); // Save activities to localStorage
        const total = activities.reduce((total, activity) => total + activity.duration, 0);
        localStorage.setItem('totalDuration', total); // Save total duration to localStorage
    }, [activities]);

    const formatTime = (time) => {
        if (!time) return '';
        return moment(time).format('HH:mm');
    };

    const formatDuration = (durationInSeconds) => {
        if (!durationInSeconds || durationInSeconds < 0) return '';
        const duration = Duration.fromObject({ seconds: durationInSeconds });
        return duration.toFormat('hh:mm:ss');
    };

    const handleStartTimeChange = (date) => {
        setStartTime(date);
    };

    const handleEndTimeChange = (date) => {
        setEndTime(date);
    };

    const handleSaveActivity = () => {
        if (selectedActivity) {
            setActivities(activities.map(activity => {
                if (activity.id === selectedActivity) {
                    const endTimeMoment = moment(endTime);
                    const startTimeMoment = moment(startTime);
                    return {
                        ...activity,
                        startTime: startTime ? startTimeMoment.toDate() : activity.startTime,
                        endTime: endTime ? endTimeMoment.toDate() : activity.endTime,
                        duration: endTimeMoment.diff(startTimeMoment, 'seconds'),
                    };
                }
                return activity;
            }));
            setSelectedActivity(null);
        }
    };

    const totalDuration = activities.reduce((total, activity) => total + activity.duration, 0);

    return (
        <div className="activity-log" style={{ width: '800px' }}>
            <div className="head">
                <div className="date">Пн, Нояб. 6</div>
                <div className="total-time">{formatDuration(totalDuration)}</div>
            </div>
            <div className="activities">
                {activities.map((activity) => (
                    <div key={activity.id} className="activity">
                        <div className="activity-info-1">
                            <div className="activity-type">{activity.type}</div>
                            <div className="activity-times">
                                {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                            </div>
                        </div>
                        <div className="activity-controls">
                            {selectedActivity === activity.id && (
                                <>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        timeCaption="time"
                                        dateFormat="HH:mm"
                                        showMonthYearDropdown
                                    />
                                    <DatePicker
                                        selected={endTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        timeCaption="time"
                                        dateFormat="HH:mm"
                                        showMonthYearDropdown
                                    />
                                    <Button onClick={handleSaveActivity}>Сохранить</Button>
                                </>
                            )}
                            <div className="activity-duration">{formatDuration(activity.duration)}</div>
                            {!selectedActivity && (
                                <Button icon={<EditOutlined />} onClick={() => setSelectedActivity(activity.id)} />
                            )}
                            <Button icon={<DeleteOutlined />} onClick={() => alert("Удалить")} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLog;