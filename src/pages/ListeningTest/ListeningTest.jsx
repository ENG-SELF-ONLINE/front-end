import {useParams} from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import ListeningTestComponent from "../../components/ListeningTest/ListeningTestComponent.jsx";
import './styles.css'

const ListeningTest = () => {
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
        <div className="listening-test-page">
            <Sidebar />
            <div className="listening-test-main">
                <div className="listening-test-upper-content">
                    <UpperMenu />
                </div>
                <div className="listening-test-content">
                    <h2 className="listening-test-level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <ListeningTestComponent currentLevel={activeLevel} />
                </div>
            </div>
        </div>
    );
};

export default ListeningTest;