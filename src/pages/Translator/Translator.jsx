// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {Button, Drawer, Pagination} from "antd";
import "./styles.css";
import move from "./images/move.png";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Deck from "../../components/Deck/Deck.jsx";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const ITEMS_PER_PAGE = 15;

const Translator = () => {
    const [textToTranslate, setTextToTranslate] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isEnglishLeft, setIsEnglishLeft] = useState(true);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [decks, setDecks] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const [totalDecks, setTotalDecks] = useState(0);
    const [deckWordsCount, setDeckWordsCount] = useState({});
    const isDeckSelected = (deckId) => selectedDeckId === deckId ? '' : 'deck-dimmed';

    useEffect(() => {
        fetchDecks();
    }, [currentPage]);

    const handleTranslate = async () => {
        let targetLanguage;
        let sourceLanguage;
        if (isEnglishLeft) {
            targetLanguage = "ru"
            sourceLanguage = "en"
        } else {
            targetLanguage = "en";
            sourceLanguage = "ru";
        }

        try {
            const response = await fetch(`http://localhost:8081/common-words/translate/${textToTranslate}?targetLanguage=${targetLanguage}&sourceLanguage=${sourceLanguage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.text();
                setTranslatedText(data);
            } else {
                console.error('Ошибка при переводе слова:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };

    const fetchDecks = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8081/decks`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    page: currentPage - 1,
                    size: ITEMS_PER_PAGE
                }
            });
            setDecks(response.data.content);
            setTotalDecks(response.data.totalElements)

            if (response.data.content.length > 0) {
                await fetchAllDeckWordCounts(response.data.content);
            }
        } catch (error) {
            console.error("Error fetching decks", error);
        }
    };

    const fetchAllDeckWordCounts = async (decks) => {
        const counts = {};
        for (const deck of decks) {
            try {
                const response = await axiosInstance.get(`http://localhost:8081/word-progress/decks/${deck.deckId}/statistics`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                counts[deck.deckId] = response.data.totalWords;
            } catch (error) {
                console.error(`Error fetching word count for deck ${deck.deckId}`, error);
                counts[deck.deckId] = 'Error';
            }
        }
        setDeckWordsCount(counts);
    };

    const handleAddToDeck = async () => {
        if (selectedDeckId) {
            let wordDTO;
            if (isEnglishLeft) {
                wordDTO = {
                    commonWord: {wordName: textToTranslate},
                    wordTranslation: translatedText
                };
            } else {
                wordDTO = {
                    commonWord: {wordName: translatedText},
                    wordTranslation: textToTranslate
                };
            }

            const formData = new FormData();
            formData.append("wordDTO", new Blob([JSON.stringify(wordDTO)], {type: "application/json"}));

            try {
                const response = await fetch(`http://localhost:8081/words/decks/${selectedDeckId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData
                });

                if (response.ok) {
                    console.log("Слово добавлено в колоду");
                } else {
                    console.error('Ошибка при добавлении слова в колоду:', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
            }
        }
        setDrawerVisible(false);
        setSelectedDeckId(null);
    };

    const handleDeckSelect = (deckId) => {
        setSelectedDeckId(deckId);
    };

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=DECKS&file=${coverImage}`;
    };

    const getDeckWordsCount = (deckId) => {
        return deckWordsCount[deckId] || 0;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentDecks = decks.slice(0, ITEMS_PER_PAGE);

    return (
        <div className="translator-page">
            <Sidebar/>
            <div className="translator-main">
                <div className="translator-upper-content">
                    <UpperMenu/>
                </div>
                <div className="translation-container">
                    <h1 className="translator-title">Translator</h1>
                    <div className="input-containers">
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Английский" : "Русский"}
                            </p>
                            <textarea
                                value={textToTranslate}
                                onChange={
                                    (e) => setTextToTranslate(e.target.value)

                                }
                                className="translation-input"
                                wrap="soft"
                            />
                        </div>
                        <div
                            className="text-image-container"
                            onClick={() => setIsEnglishLeft(!isEnglishLeft)}
                        >
                            <img src={move} alt=""/>
                        </div>
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Русский" : "Английский"}
                            </p>
                            <textarea
                                value={translatedText}
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
                    <Button className="move-button-style" onClick={() => setDrawerVisible(true)}>
                        В словарь
                    </Button>
                </div>
            </div>

            <Drawer
                title="Выберите колоду"
                visible={isDrawerVisible}
                onClose={() => {
                    setDrawerVisible(false);
                    setSelectedDeckId(null);
                }}
                width={1200}
            >
                <div className="deck-containers">
                    {currentDecks.map((deck) => (
                        <div
                            key={deck.deckId}
                            className={`deck-option ${isDeckSelected(deck.deckId)}`}
                            onClick={() => handleDeckSelect(deck.deckId)}
                        >
                            <Deck key={deck.deckId} deckData={{
                                coverImage: getCoverImageUrl(deck.deckPhoto),
                                deckName: deck.deckName,
                                author: getDeckWordsCount(deck.deckId),
                            }} onClick={() => handleDeckSelect(deck.deckId)}/>
                        </div>
                    ))}
                </div>
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={totalDecks}
                    showSizeChanger={false}
                    pageSize={ITEMS_PER_PAGE}
                />
                <Button type="primary" onClick={handleAddToDeck} disabled={!selectedDeckId} style={{marginTop: '30px'}}>
                    Добавить слово
                </Button>
            </Drawer>
        </div>
    );
};

export default Translator;