// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import CardMenuContainer from "../../components/CardMenuContainer/CardMenuContainer.jsx";
import Word from "../../components/Word/Word.jsx";

const mockDecks = [
    {
        id: 1, title: "Животные", newItems: 10, learning: 5, repeatable: 15, words: [
            {
                id: 1,
                word: "Cat",
                translation: "Кот",
                image: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5"
            },
            {
                id: 2,
                word: "Dog",
                translation: "Собака",
                image: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5"
            },
            {
                id: 3,
                word: "Bird",
                translation: "Птица",
                image: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5"
            }
        ]
    }
];

const GuessWord = () => {
    const [selectedDeck] = useState(mockDecks[0]);
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false); // Состояние для показа перевода
    const [showDifficultyButtons, setShowDifficultyButtons] = useState(false); // Состояние для кнопок сложности
    const [showAnswerButton, setShowAnswerButton] = useState(true);
    const { title: deckTitle, words } = selectedDeck;

    useEffect(() => {
        const chooseRandomWord = () => {
            if (words && words.length > 0) {
                const randomIndex = Math.floor(Math.random() * words.length);
                setCurrentWord(words[randomIndex]);
            }
        };
        chooseRandomWord();
    }, [words]);

    const handleShowAnswer = () => {
        setShowTranslation(true);
        setShowDifficultyButtons(true);
        setShowAnswerButton(false); // Скрываем кнопку "Ответ"
    };

    const handleNextWord = () => {
        setShowTranslation(false);
        setShowDifficultyButtons(false);
        setShowAnswerButton(true);
        const chooseRandomWord = () => {
            if (words && words.length > 0) {
                const randomIndex = Math.floor(Math.random() * words.length);
                setCurrentWord(words[randomIndex]);
            }
        };
        chooseRandomWord();
    };

    const handleDifficultyClick = (diff) => {
        console.log("Установили новую сложность для слова:" + diff);
        handleNextWord();
    };


    return (
        <div className="guess-page">
            <Sidebar />
            <div className="guess-main">
                <div className="guess-upper-content">
                    <UpperMenu />
                </div>
                <div className="guess-container">
                    <h1 className="guess-title">{deckTitle}</h1>
                    <div className="guess-container-with-stats">
                        <div className="card-guess-stats-container1">
                            <CardMenuContainer />
                            <div className="card-guess-stats-container">
                                {currentWord && <Word wordData={currentWord}/>}
                                {showTranslation && <p>{currentWord.translation}</p>}
                                <div className="buttons-container">
                                    {showAnswerButton && <button onClick={handleShowAnswer}>Ответ</button>}
                                    <button onClick={handleNextWord}>Заменить слово</button>
                                    {showDifficultyButtons && (
                                        <>
                                            <button data-difficulty="hard"
                                                    onClick={() => handleDifficultyClick('hard')}>Трудно
                                            </button>
                                            <button data-difficulty="medium"
                                                    onClick={() => handleDifficultyClick('medium')}>Хорошо
                                            </button>
                                            <button data-difficulty="easy"
                                                    onClick={() => handleDifficultyClick('easy')}>Легко
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuessWord;