// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import './styles.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";

const Grammar = () => {
    const { level } = useParams();
    const [activeLevel, setActiveLevel] = useState(level || "A1");
    const [lessons, setLessons] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const getLevelDescription = (level) => {
        switch (level) {
            case 'A1':
                return 'Elementary';
            case 'A2':
                return 'Pre-intermediate';
            case 'B1':
                return 'Intermediate';
            case 'B2':
                return 'Upper-intermediate';
            case 'C1':
                return 'Advanced';
            case 'C2':
                return 'Proficiency';
            default:
                return '';
        }
    };

    useEffect(() => {
        setActiveLevel(level);
    }, [level]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8083/lessons?level=${activeLevel}&type=GRAMMAR`, // Type is GRAMMAR
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // Include access token
                        },
                    }
                );
                setLessons(response.data); // Update state with fetched lessons
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };

        fetchLessons();
    }, [activeLevel, accessToken]); // Add accessToken as dependency

    return (
        <div className="grammar-page">
            <Sidebar />
            <div className="grammar-main">
                <div className="grammar-upper-content">
                    <UpperMenu />
                </div>
                <div className="grammar-content">
                    <h2 className="grammar-level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <ul className="grammar-topics">
                        {lessons.map((lesson) => ( // Use lessons from the API
                            <li key={lesson.lessonId}> {/* Use unique lessonId as key */}
                                <Link to={`/grammar/${activeLevel}/${lesson.lessonId}`}> {/* Adjust link */}
                                    {lesson.title} {/* Display lesson title */}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Grammar;