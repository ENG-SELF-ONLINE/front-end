// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Drawer, Pagination } from "antd"; // Изменяем на Drawer
import "./styles.css";
import move from "./images/move.png";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Deck from "../../components/Deck/Deck.jsx";

// Пример колод, которые могли бы быть у вас
const decks = [
    { id: 1, title: "English-Russian Vocabulary", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 2, title: "Programming Terms", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 3, title: "Math Formulas", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 4, title: "History Facts", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 5, title: "Science Terms", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 6, title: "Literature Quotes", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 7, title: "Art Styles", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 8, title: "Political Theories", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 9, title: "Economics Basics", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 10, title: "Social Studies", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 11, title: "Geography Terms", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 12, title: "Health Facts", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 13, title: "Music Theory", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 14, title: "Film Studies", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 15, title: "Architecture Styles", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
    { id: 16, title: "Psychology Basics", author: "22", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5" },
];

const ITEMS_PER_PAGE = 15;

const Translator = () => {
    const [textToTranslate, setTextToTranslate] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isEnglishLeft, setIsEnglishLeft] = useState(true);
    const [isDrawerVisible, setDrawerVisible] = useState(false); // Изменяем на isDrawerVisible
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const isDeckSelected = (deckId) => selectedDeckId === deckId ? '' : 'deck-dimmed';

    const handleTranslate = () => {
        const translation = `${textToTranslate}`;
        setTranslatedText(translation);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddToDictionary = () => {
        setDrawerVisible(true); // Показываем Drawer
    };

    const handleAddToDeck = () => {
        if (selectedDeckId) {
            const deckToUpdate = decks.find(deck => deck.id === selectedDeckId);
            console.log("Adding to deck:", deckToUpdate.title, "with word:", textToTranslate);
            // Здесь вы можете добавить логику для добавления слова в колоду (например, отправка на сервер или обновление состояния)
        }
        setDrawerVisible(false); // Закрыть модальное окно
        setSelectedDeckId(null);
    };

    const handleDeckSelect = (deckId) => {
        setSelectedDeckId(deckId);
    };

    // Вычисляем индексы для текущей страницы
    const indexOfLastDeck = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstDeck = indexOfLastDeck - ITEMS_PER_PAGE;
    const currentDecks = decks.slice(indexOfFirstDeck, indexOfLastDeck);
    const totalPages = Math.ceil(decks.length / ITEMS_PER_PAGE);

    return (
        <div className="translator-page">
            <Sidebar />
            <div className="translator-main">
                <div className="translator-upper-content">
                    <UpperMenu />
                </div>
                <div className="translation-container">
                    <h1 className="translator-title">Translator</h1>
                    <div className="input-containers">
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Английский" : "Русский"}
                            </p>
                            <textarea
                                value={isEnglishLeft ? textToTranslate : translatedText}
                                onChange={
                                    isEnglishLeft
                                        ? (e) => setTextToTranslate(e.target.value)
                                        : (e) => setTranslatedText(e.target.value)
                                }
                                className="translation-input"
                                wrap="soft"
                            />
                        </div>
                        <div
                            className="text-image-container"
                            onClick={() => setIsEnglishLeft(!isEnglishLeft)}
                        >
                            <img src={move} alt="" />
                        </div>
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Русский" : "Английский"}
                            </p>
                            <textarea
                                value={isEnglishLeft ? translatedText : textToTranslate}
                                readOnly
                                className="translation-output"
                                wrap="soft"
                            />
                        </div>
                    </div>
                </div>
                <div className="translate-button-container">
                    <Button className="translate-button-style" onClick={handleTranslate}>
                        Перевести
                    </Button>
                    <Button className="move-button-style" onClick={handleAddToDictionary}>
                        В словарь
                    </Button>
                </div>
            </div>

            <Drawer
                title="Выберите колоду"
                visible={isDrawerVisible}
                onClose={() => {
                    setDrawerVisible(false);
                    setSelectedDeckId(null); // Сброс выбора колоды
                }}
                width={1200}
            >
                <div className="deck-containers">
                    {currentDecks.map(deck => (
                        <div
                            key={deck.id}
                            className={`deck-option ${isDeckSelected(deck.id)}`}
                            onClick={() => handleDeckSelect(deck.id)}
                        >
                            <Deck deckData={deck} style={{opacity: isDeckSelected(deck.id)}} />
                        </div>
                    ))}
                </div>
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={totalPages}
                    showSizeChanger={false}
                    pageSize={1}
                />
                <Button type="primary" onClick={handleAddToDeck} disabled={!selectedDeckId} style={{ marginTop: '30px' }}>
                    Добавить слово
                </Button>
            </Drawer>
        </div>
    );
};

export default Translator;