// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import './styles.css'
import {Link, useParams} from "react-router-dom";

const Listening = () => {
    const { level } = useParams();
    const [activeLevel, setActiveLevel] = useState(level || "A1");

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

    // Mock data for topics relevant to the A1 level
    const topics = [
        { id: 1, title: "Introduction to English" },
        { id: 2, title: "Simple Present Tense" },
        { id: 3, title: "Wh- Questions" },
        { id: 4, title: "Countable and Uncountable Nouns" },
        { id: 5, title: "Common Adjectives" },
        { id: 6, title: "Everyday Vocabulary" }
    ];

    useEffect(() => {
        setActiveLevel(level);
    }, [level]);

    return (
        <div className="listening-page">
            <Sidebar />
            <div className="listening-main">
                <div className="listening-upper-content">
                    <UpperMenu />
                </div>
                <div className="listening-content">
                    <h2 className="listening-level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <ul className="listening-topics">
                        {topics.map((topic) => (
                            <li key={topic.id}>
                                <Link to={`/listening/${activeLevel}/${topic.id}`}> {/*  Link для перехода  */}
                                    {topic.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Listening;