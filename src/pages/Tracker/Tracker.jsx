// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import { Select, Button } from "antd";
import DatePicker from "react-datepicker";
import ActivityLog from "../../components/ActivityLog/ActivityLog.jsx";
import { PlusOutlined } from "@ant-design/icons";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const { Option } = Select;

const Tracker = () => {
    const [activityType, setActivityType] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [dateActivity, setDateActivity] = useState(new Date());
    const [activities, setActivities] = useState([]);

    const handleAddActivity = () => {
        if (activityType && startTime && endTime && endTime > startTime) {
            const newActivity = {
                id: Math.random(), // Лучше использовать более надежный способ генерации уникальных ID
                type: activityType,
                startTime: moment(dateActivity).set({
                    hours: startTime.getHours(),
                    minutes: startTime.getMinutes(),
                }).toDate(),
                endTime: moment(dateActivity).set({
                    hours: endTime.getHours(),
                    minutes: endTime.getMinutes(),
                }).toDate(),
                duration: moment(endTime).diff(moment(startTime), 'seconds')
            };

            setActivities(prevActivities => [...prevActivities, newActivity]);

            // Сброс полей
            setActivityType('');
            setStartTime(null);
            setEndTime(null);
            setDateActivity(new Date());
        }
    };

    return (
        <div className="activity-page">
            <Sidebar />
            <div className="activity-main">
                <div className="activity-upper-content">
                    <UpperMenu />
                </div>
                <div className="activity-container">
                    <h1 className="activity-title">Tracker</h1>
                    <div className="project-timer-container">
                        <div className="project-info-container1">
                            <Select
                                placeholder="Над чем ты работаешь?"
                                value={activityType}
                                onChange={setActivityType}
                                style={{ width: 200 }}
                            >
                                <Option value="reading">Reading</Option>
                                <Option value="grammar">Grammar</Option>
                                <Option value="listening">Listening</Option>
                            </Select>
                        </div>
                        <div className="project-info-container">
                            <DatePicker
                                selected={startTime}
                                onChange={setStartTime}
                                showTimeSelect
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                placeholderText="Start Time"
                             showMonthYearDropdown/>
                            <DatePicker
                                selected={endTime}
                                onChange={setEndTime}
                                showTimeSelect
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                placeholderText="End Time"
                             showMonthYearDropdown/>
                            <Button size="middle" icon={<PlusOutlined />} onClick={handleAddActivity}/>
                        </div>
                    </div>
                    <div className="weekly-activity">
                        <h3>Недельная активность</h3>
                        <p>Всего: {moment.utc(activities.reduce((total, activity) => total + activity.duration, 0) * 1000).format('HH:mm:ss')}</p>
                    </div>
                    <div className="weekly-activity-content">
                        <button style={{height: '10px', width: '10px'}}/>
                        <div className="weekly-activity-info">
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                            <ActivityLog/>
                        </div>
                        <button style={{height: '10px', width: '10px'}}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracker;