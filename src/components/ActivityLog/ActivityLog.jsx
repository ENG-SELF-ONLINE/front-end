// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {Button, TimePicker} from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import './styles.css';
import {Duration} from 'luxon';

const ActivityLog = ({activities, onActivitiesChange}) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [activityList, setActivityList] = useState(activities);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        setActivityList(activities);
    }, [activities]);

    const formatTime = (time) => {
        if (!time) return '';
        return moment(time).format('HH:mm');
    };

    const formatDuration = (durationInSeconds) => {
        if (!durationInSeconds || durationInSeconds < 0) return '';
        const duration = Duration.fromObject({minutes: durationInSeconds});
        return duration.toFormat('hh:mm:ss');
    };

    const handleStartTimeChange = (time) => {
        console.log('Start Time Changed:', time);
        setStartTime(time);
    };

    const handleEndTimeChange = (time) => {
        console.log('End Time Changed:', time);
        setEndTime(time);
    };

    const handleSaveActivity = () => {
        if (selectedActivity && startTime && endTime) {
            const updatedStartTime = startTime.format('YYYY-MM-DDTHH:mm:ss');
            const updatedEndTime = endTime.format('YYYY-MM-DDTHH:mm:ss');

            const durationInSeconds = moment(updatedEndTime).diff(moment(updatedStartTime), 'minutes');

            const updatedActivity = {
                startTime: updatedStartTime,
                endTime: updatedEndTime,
                duration: durationInSeconds,
            };

            fetch(`http://localhost:8085/trackers/${selectedActivity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedActivity),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedActivities = activityList.map(activity => {
                        if (activity.activityTrackerId === selectedActivity) {
                            return {
                                ...activity,
                                startTime: updatedStartTime,
                                endTime: updatedEndTime,
                                duration: durationInSeconds,
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
                })
                .catch((error) => {
                    console.error('Error updating activity:', error);
                    alert('Failed to update activity. Please try again.');
                });
        }
    };

    const handleDeleteActivity = (activityId) => {
        fetch(`http://localhost:8085/trackers/${activityId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedActivities = activityList.filter(activity => activity.activityTrackerId !== activityId);
                setActivityList(updatedActivities);
                if (onActivitiesChange) {
                    onActivitiesChange(updatedActivities);
                }
            })
            .catch((error) => {
                console.error('Error deleting activity:', error);
                alert('Failed to delete activity. Please try again.');
            });
    };

    const activitiesByDate = activityList.reduce((acc, activity) => {
        const date = activity.startTime.substring(0, 10);
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
        <div className="activity-log" style={{width: '800px'}}>
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
                            <div key={activity.activityTrackerId} className="activity">
                                <div className="activity-info-1">
                                    <div className="activity-type"
                                         style={{width: "105px"}}>{activity.activityType}</div>
                                    <div className="activity-times">
                                        {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                    </div>
                                </div>
                                <div className="activity-controls">
                                    {selectedActivity === activity.activityTrackerId && (
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
                                        <Button icon={<EditOutlined/>}
                                                onClick={() => setSelectedActivity(activity.activityTrackerId)}/>
                                    )}
                                    <Button icon={<DeleteOutlined/>}
                                            onClick={() => handleDeleteActivity(activity.activityTrackerId)}/>
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
            activityTrackerId: PropTypes.string.isRequired,
            activityType: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string.isRequired,
            duration: PropTypes.number.isRequired,
        })
    ).isRequired,
    onActivitiesChange: PropTypes.func,
};

export default ActivityLog;