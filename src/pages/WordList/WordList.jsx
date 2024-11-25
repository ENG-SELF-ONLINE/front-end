// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import CardMenuContainer from "../../components/CardMenuContainer/CardMenuContainer.jsx";
import { Button, Input, Modal } from "antd";
import Deck from "../../components/Deck/Deck.jsx";

const mockDecks = [
    {
        id: 1, title: "Животные", coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
        newItems: 10, learning: 5, repeatable: 15, words: [
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

const WordList = () => {
    const [selectedDeck, setSelectedDeck] = useState(mockDecks[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentWordId, setCurrentWordId] = useState(null);
    const [cardTitle, setCardTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');

    const handleChangeDeck = () => {
        if (currentWordId !== null) {
            const updatedWords = selectedDeck.words.map(item => {
                if (item.id === currentWordId) {
                    return { ...item, word: cardTitle, translation: translation };
                }
                return item;
            });

            setSelectedDeck({ ...selectedDeck, words: updatedWords });
        }
        resetModal();
    };

    const resetModal = () => {
        setIsModalVisible(false);
        setWord('');
        setTranslation('');
        setCardTitle('');
        setImageUrl(null);
        setCurrentWordId(null);
    };

    const openEditModal = (item) => {
        setCurrentWordId(item.id);
        setWord(item.word);
        setTranslation(item.translation);
        setCardTitle(item.word);
        setImageUrl(item.image);
        setIsModalVisible(true);
    };

    return (
        <div className="word-list-page">
            <Sidebar />
            <div className="word-list-main">
                <div className="word-list-upper-content">
                    <UpperMenu/>
                </div>
                <div className="word-list-container">
                    <h1 className="word-list-title">{selectedDeck.title}</h1>
                    <div className="word-list-container-with-stats">
                        <div className="word-list-stats-container1">
                            <CardMenuContainer deckData={selectedDeck}/>
                        </div>
                        <div className="word-list-stats-container2">
                            <div className="vertical-centered-container">
                                <div className="word-translation-view-action-container">
                                    <p className="word-translation-display-style">Слово</p>
                                    <p className="word-translation-display-style">Перевод</p>
                                    <p className="highlighted-text">К просмотру</p>
                                    <p className="word-translation-display-style">Действие</p>
                                </div>
                                <div className="animal-info-container">
                                    {selectedDeck.words.map((item) => (
                                        <div key={item.id} className="flex-row-with-buttons">
                                            <div className="flex-container-with-buttons">
                                                <p className="animal-title">{item.word}</p>
                                            </div>
                                            <div className="flex-container-with-buttons">
                                                <p className="animal-title-text-style">{item.translation}</p>
                                            </div>
                                            <p className="animal-title-text-style">25.11.2024</p>
                                            <div className="flex-container-with-buttons">
                                                <Button className="button-style-primary"
                                                        onClick={() => openEditModal(item)}>Изменить</Button>
                                                <Button className="action-button">Удалить</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalVisible && (
                <div className="modal-overlay">
                    <Modal
                        title="Изменение слова"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={resetModal}
                        style={{font: "16px 'GOST Type A', cursive"}}
                    >
                        <div className="modal-containers">
                            <div className="left-container">
                                <p className="word-card-menu">Введите слово</p>
                                <Input
                                    value={word}
                                    placeholder="Слово"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setWord(value);
                                        setCardTitle(value); // Сохраняем значение
                                    }}
                                    size="large"
                                />
                                <p className="word-card-menu">Введите перевод</p>
                                <Input
                                    value={translation}
                                    placeholder="Перевод"
                                    onChange={(e) => setTranslation(e.target.value)} // Исправлено
                                    size="large"
                                />
                                <div style={{margin: '30px 0'}}>
                                    <Button onClick={() => {
                                        const newImageUrl = prompt("Введите URL изображения:");
                                        if (newImageUrl) {
                                            setImageUrl(newImageUrl);
                                        }
                                    }}>Выбрать фотографию</Button>
                                </div>
                            </div>
                            <div className="right-container">
                                <Deck
                                    deckData={{
                                        coverImage: imageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
                                        title: cardTitle || 'Слово',
                                    }}
                                />
                            </div>
                        </div>
                        <Button className="create-button-modal" type="primary" onClick={handleChangeDeck}>Изменить</Button>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default WordList;
