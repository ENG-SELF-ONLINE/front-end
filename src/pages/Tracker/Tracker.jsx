// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css';
import Sidebar from '../../components/MainMenu/Sidebar.jsx';
import UpperMenu from '../../components/UpperMenu/UpperMenu.jsx';
import {Button, Select, TimePicker} from 'antd';
import DatePicker from 'react-datepicker';
import ActivityLog from '../../components/ActivityLog/ActivityLog.jsx';
import {PlusOutlined} from '@ant-design/icons';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const {Option} = Select;

const Tracker = () => {
    const [activityType, setActivityType] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [dateActivity, setDateActivity] = useState(new Date());
    const [activityLogs, setActivityLogs] = useState({});
    const [activeWeek, setActiveWeek] = useState(0);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const startDate = getStartDateForWeek(activeWeek);
                const endDate = getEndDateForWeek(activeWeek);

                const formattedStartDate = startDate.toISOString();
                const formattedEndDate = endDate.toISOString();

                const response = await axiosInstance.get(`http://localhost:8085/trackers?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const fetchedLogs = response.data.reduce((acc, activity) => {
                    const activityDate = moment(activity.startTime).local().format('YYYY-MM-DD');
                    if (!acc[activityDate]) {
                        acc[activityDate] = {date: activityDate, activities: []};
                    }
                    acc[activityDate].activities.push(activity);
                    return acc;
                }, {});

                setActivityLogs(fetchedLogs);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [activeWeek, accessToken]);

    const handleStartTimeChange = (date) => {
        setStartTime(date);
    };

    const handleEndTimeChange = (date) => {
        setEndTime(date);
    };

    const createNewActivity = (activityType, dateActivity, startTime, endTime) => {
        const startMoment = moment(dateActivity).set({
            hours: startTime.hour(),
            minutes: startTime.minute(),
        });

        const endMoment = moment(dateActivity).set({
            hours: endTime.hour(),
            minutes: endTime.minute(),
        });

        const durationInSeconds = endMoment.diff(startMoment, 'minutes');
        const duration = moment.utc(durationInSeconds * 60 * 1000).format('HH:mm:ss');

        return {
            activityType: activityType,
            date: moment(dateActivity).format('YYYY-MM-DD'),
            startTime: startMoment.format('YYYY-MM-DDTHH:mm'),
            endTime: endMoment.format('YYYY-MM-DDTHH:mm'),
            duration: durationInSeconds,
            durationFormat: duration,
        };
    };

    const handleAddActivity = async () => {
        if (activityType && startTime && endTime && endTime.isAfter(startTime)) {
            const newActivity = createNewActivity(activityType, dateActivity, startTime, endTime);
            const activityDate = newActivity.date;

            try {
                await axiosInstance.post('http://localhost:8085/trackers', {
                    activityType: activityType,
                    startTime: newActivity.startTime,
                    endTime: newActivity.endTime,
                    duration: newActivity.duration,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                // Обновляем логи активности
                setActivityLogs((prevLogs) => {
                    if (prevLogs[activityDate]) {
                        return {
                            ...prevLogs,
                            [activityDate]: {
                                ...prevLogs[activityDate],
                                activities: [...prevLogs[activityDate].activities, newActivity],
                            },
                        };
                    } else {
                        return {
                            ...prevLogs,
                            [activityDate]: {
                                date: activityDate,
                                activities: [newActivity],
                            },
                        };
                    }
                });
                // Сбрасываем состояние
                setActivityType('');
                setStartTime(null);
                setEndTime(null);
                setDateActivity(new Date());
            } catch (error) {
                console.error('Ошибка при добавлении активности:', error);
                alert('Произошла ошибка при добавлении активности. Пожалуйста, попробуйте снова.');
            }
        } else {
            alert('Пожалуйста, убедитесь, что все поля заполнены корректно.');
        }
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

    // Сортируем activityLogs по дате (убывание)
    const sortedActivityLogs = Object.entries(activityLogs)
        .sort(([dateA], [dateB]) => moment(dateB).valueOf() - moment(dateA).valueOf())
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek - 1));
    };

    const handleNextWeek = async () => {
        setActiveWeek(prevWeek => prevWeek + 1);
    };

    return (
        <div className="activity-page">
            <Sidebar/>
            <div className="activity-main">
                <div className="activity-upper-content">
                    <UpperMenu/>
                </div>
                <div className="activity-container">
                    <h1 className="activity-titleTrackerh1">Tracker</h1>
                    <div className="project-timer-container">
                        <div className="project-info-container1">
                            <Select
                                placeholder="Над чем ты работаешь"
                                value={activityType}
                                onChange={setActivityType}
                                style={{width: 200}}
                            >
                                <Option value="READING">READING</Option>
                                <Option value="GRAMMAR">GRAMMAR</Option>
                                <Option value="LISTENING">LISTENING</Option>
                            </Select>
                        </div>
                        <div className="project-info-container">
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
                            <DatePicker
                                selected={dateActivity}
                                onChange={setDateActivity}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                showMonthYearDropdown
                            />
                            <Button size="middle" icon={<PlusOutlined/>} onClick={handleAddActivity}/>
                        </div>
                    </div>
                    <div className="activity-middle-content">
                        <button className={`prev-week`} onClick={handlePrevWeek}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <div className="weekly-activity">
                            <h3>Недельная активность</h3>
                            <p>
                                Всего{' '}
                                {(() => {
                                    const totalMinutes = Object.values(activityLogs).reduce((total, log) => {
                                        return total + log.activities.reduce((sum, activity) => sum + activity.duration, 0);
                                    }, 0);

                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = Math.floor(totalMinutes % 60);
                                    const seconds = 0;

                                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                                })()}
                            </p>
                        </div>
                        <button
                            className={`next-week`} onClick={handleNextWeek} disabled={activeWeek === 0}>
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </button>
                    </div>
                    <div className="weekly-activity-content">
                        <div className="weekly-activity-info">
                            {Object.values(sortedActivityLogs).map((log) => (
                                <div key={log.date}>
                                    <ActivityLog activities={log.activities}
                                                 onActivitiesChange={(updatedActivities) => {
                                                     setActivityLogs(prevLogs => ({
                                                         ...prevLogs,
                                                         [log.date]: {
                                                             ...prevLogs[log.date],
                                                             activities: updatedActivities
                                                         }
                                                     }));
                                                 }}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracker;