// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import CardMenuContainer from "../../components/CardMenuContainer/CardMenuContainer.jsx";
import Word from "../../components/Word/Word.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";

const GuessWord = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);
    const [showAnswerButton, setShowAnswerButton] = useState(true);
    const {deckId} = useParams();
    const [deck, setDeck] = useState(null);
    const [order, setOrder] = useState(0);
    const [length, setLength] = useState(0);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchNextWord(order);
    }, []);

    const fetchNextWord = async (nextOrder) => {
        try {
            const deckResponse = await axios.get(`http://localhost:8081/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            setDeck(deckResponse.data);

            const response = await fetch(`http://localhost:8081/word-progress/decks/${deckId}/next`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.length > 0) {
                setLength(data.length);
                setCurrentWord(data[nextOrder]);
            } else {
                setCurrentWord(null);
                setLength(0);
            }
        } catch (error) {
            console.error('Error fetching next words:', error);
        }
    };

    const handleUpdateWordProgress = async (result) => {
        if (!currentWord) return;

        try {
            await fetch(`http://localhost:8081/word-progress/${currentWord.wordProgressId}/update?result=${result}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Updated word progress to ${result} for word: ${currentWord.word}`);
            handleFirstWord();
        } catch (error) {
            console.error('Error updating word progress:', error);
        }
    };

    const handleShowAnswer = () => {
        setShowTranslation(true);
        setShowDifficultyButtons(true);
        setShowAnswerButton(false);
    };

    const handleNextWord = () => {
        setShowTranslation(false);
        setShowDifficultyButtons(false);
        setShowAnswerButton(true);

        const nextOrder = (order + 1) % length;
        setOrder(nextOrder);

        fetchNextWord(nextOrder);
    };

    const handleFirstWord = () => {
        setShowTranslation(false);
        setShowDifficultyButtons(false);
        setShowAnswerButton(true);

        const nextOrder = 0;
        setOrder(nextOrder);

        fetchNextWord(nextOrder);
    };

    const handleDifficultyClick = (diff) => {
        handleUpdateWordProgress(diff);
    };

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=WORDS&file=${coverImage}`;
    };

    return (
        <div className="guess-page">
            <Sidebar/>
            <div className="guess-main">
                <div className="guess-upper-content">
                    <UpperMenu/>
                </div>
                <div className="guess-container">
                    <h1 className="guess-title">{deck ? deck.deckName : ''}</h1>
                    <div className="guess-container-with-stats">
                        {deck ? (
                            <>
                                <div className="card-guess-stats-container1">
                                    <CardMenuContainer deckData={{
                                        coverImage: getCoverImageUrl(deck.deckPhoto),
                                        deckName: deck.deckName,
                                        id: deck.deckId,
                                    }}/>
                                    <div className="card-guess-stats-container">
                                        {currentWord && <Word
                                            wordData={{
                                                image: getCoverImageUrl(currentWord.word.wordPhoto) || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
                                                word: currentWord.word.commonWord.wordName || 'Слово',
                                            }}
                                        />}
                                        {showTranslation && (
                                            <p className="translation-word">
                                                {currentWord.word.wordTranslation || currentWord.word.commonWord.wordTranslation || 'Перевод отсутствует'}
                                            </p>
                                        )}
                                        <div className="buttons-container">
                                            {showAnswerButton && <button onClick={handleShowAnswer}>Ответ</button>}
                                            <button onClick={handleNextWord}>Заменить слово</button>
                                            {showDifficultyButtons && (
                                                <>
                                                    <button data-difficulty="BAD"
                                                            onClick={() => handleDifficultyClick('BAD')}>Плохо
                                                    </button>
                                                    <button data-difficulty="GOOD"
                                                            onClick={() => handleDifficultyClick('GOOD')}>Хорошо
                                                    </button>
                                                    <button data-difficulty="EXCELLENT"
                                                            onClick={() => handleDifficultyClick('EXCELLENT')}>Отлично
                                                    </button>
                                                </>
                                            )}
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
        </div>
    );
};

export default GuessWord;