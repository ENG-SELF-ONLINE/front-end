// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Button, TimePicker } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './styles.css';
import { Duration } from 'luxon';

const ActivityLog = ({ activities, onActivitiesChange }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [activityList, setActivityList] = useState(activities);

    useEffect(() => {
        setActivityList(activities)
    },[activities])

    const formatTime = (time) => {
        if (!time) return '';
        return moment(time, 'HH:mm').format('HH:mm');
    };

    const formatDuration = (durationInSeconds) => {
        if (!durationInSeconds || durationInSeconds < 0) return '';
        const duration = Duration.fromObject({ seconds: durationInSeconds });
        return duration.toFormat('hh:mm:ss');
    };


    const handleStartTimeChange = (time) => {
        setStartTime(time);
    };

    const handleEndTimeChange = (time) => {
        setEndTime(time);
    };

    const calculateDuration = (dateActivity, startTime, endTime) => {
        const startMoment = moment(dateActivity).set({
            hours: startTime.hour(),
            minutes: startTime.minute(),
        });

        const endMoment = moment(dateActivity).set({
            hours: endTime.hour(),
            minutes: endTime.minute(),
        });

        const durationInSeconds = endMoment.diff(startMoment, 'seconds');
        const duration = moment.utc(moment.duration(durationInSeconds, 'seconds').asMilliseconds()).format('HH:mm:ss');

        return { durationInSeconds, duration };
    };

    const handleSaveActivity = () => {
        if (selectedActivity && startTime && endTime) {
            const updatedActivities = activityList.map(activity => {
                if (activity.id === selectedActivity) {
                    const { durationInSeconds, duration } = calculateDuration(selectedActivity, startTime, endTime);
                    return {
                        ...activity,
                        startTime: moment(selectedActivity).set({
                            hours: startTime.hour(),
                            minutes: startTime.minute(),
                        }).format('HH:mm'),
                        endTime: moment(selectedActivity).set({
                            hours: endTime.hour(),
                            minutes: endTime.minute(),
                        }).format('HH:mm'),
                        duration: durationInSeconds,
                        durationFormat: duration,
                    };
                }
                return activity;
            });
            setActivityList(updatedActivities);
            if (onActivitiesChange) {
                onActivitiesChange(updatedActivities);
            }
            setSelectedActivity(null);
            setStartTime(null);
            setEndTime(null);
        }
    };


    const activitiesByDate = activityList.reduce((acc, activity) => {
        const date = activity.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
    }, {});



    if (activityList.length === 0) {
        return null;
    }


    return (
        <div className="activity-log" style={{ width: '800px' }}>
            {Object.entries(activitiesByDate).map(([date, activities]) => (
                <div key={date}>
                    <div className="head">
                        <div className="date">{date}</div>
                        <div className="total-time">
                            {formatDuration(activities.reduce((total, activity) => total + activity.duration, 0))}
                        </div>
                    </div>
                    <div className="activities">
                        {activities.map((activity) => (
                            <div key={activity.id} className="activity">
                                <div className="activity-info-1">
                                    <div className="activity-type" style={{ width: "105px" }}>{activity.type}</div>
                                    <div className="activity-times">
                                        {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                    </div>
                                </div>
                                <div className="activity-controls">
                                    {selectedActivity === activity.id && (
                                        <>
                                            <TimePicker
                                                value={startTime}
                                                onChange={handleStartTimeChange}
                                                format="HH:mm"
                                                minuteStep={5}
                                            />
                                            <TimePicker
                                                value={endTime}
                                                onChange={handleEndTimeChange}
                                                format="HH:mm"
                                                minuteStep={5}
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
            ))}
        </div>
    );
};


ActivityLog.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string.isRequired,
            duration: PropTypes.number.isRequired,
            durationFormat: PropTypes.string.isRequired,
        })
    ).isRequired,
    onActivitiesChange: PropTypes.func,
};
export default ActivityLog;