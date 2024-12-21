// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import './styles.css';
import Sidebar from '../../components/MainMenu/Sidebar.jsx';
import UpperMenu from '../../components/UpperMenu/UpperMenu.jsx';
import {Select, Button, TimePicker} from 'antd';
import DatePicker from 'react-datepicker';
import ActivityLog from '../../components/ActivityLog/ActivityLog.jsx';
import {PlusOutlined} from '@ant-design/icons';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

const {Option} = Select;

const Tracker = () => {
    const [activityType, setActivityType] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [dateActivity, setDateActivity] = useState(new Date());
    const [activityLogs, setActivityLogs] = useState({});
    const [activeWeek, setActiveWeek] = useState(0);
    const [hasNextWeekData] = useState(true); // Состояние для отслеживания наличия данных


    const handleStartTimeChange = (date) => {
        setStartTime(date);
    };

    const handleEndTimeChange = (date) => {
        setEndTime(date);
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

        return {durationInSeconds, duration};
    };

    const createNewActivity = (activityType, dateActivity, startTime, endTime) => {
        const {durationInSeconds, duration} = calculateDuration(dateActivity, startTime, endTime);
        return {
            id: Date.now(),
            type: activityType,
            date: moment(dateActivity).format('YYYY-MM-DD'),
            startTime: moment(dateActivity).set({
                hours: startTime.hour(),
                minutes: startTime.minute(),
            }).format('HH:mm'),
            endTime: moment(dateActivity).set({
                hours: endTime.hour(),
                minutes: endTime.minute(),
            }).format('HH:mm'),
            duration: durationInSeconds,
            durationFormat: duration,
        };
    };

    const handleAddActivity = () => {
        if (activityType && startTime && endTime && endTime.isAfter(startTime)) {
            const {durationInSeconds} = calculateDuration(dateActivity, startTime, endTime)
            // Проверка на превышение продолжительности 24 часа
            if (durationInSeconds > 86400) {
                alert('Активность не может превышать 24 часа.');
                return;
            }


            const newActivity = createNewActivity(activityType, dateActivity, startTime, endTime);
            const activityDate = newActivity.date;

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

            // Сброс полей
            setActivityType('');
            setStartTime(null);
            setEndTime(null);
            setDateActivity(new Date());
        } else {
            alert('Пожалуйста, убедитесь, что все поля заполнены корректно.');
        }
    };

    // Сортируем activityLogs по дате (убывание)
    const sortedActivityLogs = Object.entries(activityLogs)
        .sort(([dateA], [dateB]) => moment(dateB).valueOf() - moment(dateA).valueOf())
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    const handlePrevWeek = () => {
        setActiveWeek(prevWeek => (prevWeek > 0 ? prevWeek - 1 : 0));
    };

    const handleNextWeek = () => {
        if (hasNextWeekData) {
            setActiveWeek(prevWeek => prevWeek + 1);
        }
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
                                <Option value="Reading">Reading</Option>
                                <Option value="Grammar">Grammar</Option>
                                <Option value="Listening">Listening</Option>
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
                        <button className={`prev-week ${activeWeek === 0 ? 'disabled' : ''}`} onClick={handlePrevWeek}
                                disabled={activeWeek === 0}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <div className="weekly-activity">
                            <h3>Недельная активность</h3>
                            <p>
                                Всего{' '}
                                {(() => {
                                    const totalSeconds = Object.values(activityLogs).reduce((total, log) => {
                                        return total + log.activities.reduce((sum, activity) => sum + activity.duration, 0);
                                    }, 0);

                                    const hours = Math.floor(totalSeconds / 3600);
                                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                                    const seconds = totalSeconds % 60;

                                    // Форматируем с добавлением нуля перед числом, если оно меньше 10
                                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                                })()}
                            </p>
                        </div>
                        <button className={`next-week ${!hasNextWeekData ? 'disabled' : ''}`} onClick={handleNextWeek}
                                disabled={!hasNextWeekData}>
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
                                                         }
                                                     ))
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