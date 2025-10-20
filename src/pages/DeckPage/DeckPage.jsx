// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {Button} from "@mui/base";
import CardMenuContainer from "../../components/CardMenuContainer/CardMenuContainer.jsx";
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const DeckPage = () => {
    const {deckId} = useParams();
    const [deck, setDeck] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchDeckAndStatistics = async () => {
            try {
                const deckResponse = await axiosInstance.get(`http://localhost:8081/decks/${deckId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                setDeck(deckResponse.data);

                const statisticsResponse = await axiosInstance.get(`http://localhost:8081/word-progress/decks/${deckId}/statistics`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                setStatistics(statisticsResponse.data);
            } catch (error) {
                console.error("Error fetching deck and statistics", error);
            }
        };

        fetchDeckAndStatistics();
    }, [deckId, accessToken]);

    const handleLearnWord = () => {
        navigate(`/decks/${deckId}/learning`);
    };

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=DECKS&file=${coverImage}`;
    };

    if (!deck || !statistics) {
        return <div></div>;
    }

    return (
        <div className="deck-page">
            <Sidebar/>
            <div className="deck-main">
                <div className="deck-upper-content">
                    <UpperMenu/>
                </div>
                <div className="deck-container">
                    {deck ? (
                        <>
                            <h1 className="deck-title">{deck.deckName}</h1>
                            <div className="card-container-with-stats">
                                <div className="card-deck-stats-container1">
                                    <CardMenuContainer deckData={{
                                        coverImage: getCoverImageUrl(deck.deckPhoto),
                                        deckName: deck.deckName,
                                        id: deck.deckId,
                                    }}/>
                                    <div className="card-deck-stats-container">
                                        <div className="learning-status-container">
                                            <div className="status-panel">
                                                <div className="new-items-container">
                                                    <p className="category-label-text-style">Новые:</p>
                                                </div>
                                                <div className="vertical-number-container">
                                                    <p className="blue-heading">{statistics.newWords}</p>
                                                </div>
                                            </div>
                                            <div className="horizontal-list-with-labels">
                                                <div className="vertical-flex-container">
                                                    <p className="category-label-text-style">Изучаемые:</p>
                                                </div>
                                                <div className="vertical-centered-column">
                                                    <p className="fiery-heading">{statistics.learningWords}</p>
                                                </div>
                                            </div>
                                            <div className="horizontal-list-container">
                                                <div className="column-flex-container">
                                                    <p className="category-label-text-style">Повторяемые:</p>
                                                </div>
                                                <div className="repeatable-number-container">
                                                    <p className="green-heading">{statistics.repeatingWords}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="learning-button-container">
                                            <Button className="learn-button-style" onClick={handleLearnWord}>
                                                Учить
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeckPage;