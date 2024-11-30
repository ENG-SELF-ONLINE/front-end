// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import './styles.css'
import {useParams} from "react-router-dom";
import Article from "../../components/Article/Article.jsx";

const Grammar = () => {
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

    useEffect(() => {
        setActiveLevel(level);
    }, [level]);

    return (
        <div className="topic-page">
            <Sidebar />
            <div className="topic-main">
                <div className="topic-upper-content">
                    <UpperMenu />
                </div>
                <div className="topic-content">
                    <h2 className="topic-level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <Article/>
                </div>
            </div>
        </div>
    );
};

export default Grammar;