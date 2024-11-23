// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import { Button } from '@mui/base';
import './styles.css';
import {Input, Modal} from "antd";
import Deck from "../Deck/Deck.jsx";
import PropTypes from "prop-types"; // Импортируем стили, если это необходимо

const CardMenuContainer = ({ deckData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cardTitle, setCardTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');

    useEffect(() => {
        // Обновляем состояние при изменении deckData
        setCardTitle(deckData.title);
        setImageUrl(deckData.coverImage);
    }, [deckData]); // Зависимость от deckData

    const handleAddDeck = () => {
        console.log("Добавить колоду!");
        // После создания можно закрыть модал
        resetModal();
    };

    const handleListDecks = () => {
        console.log("Список колод!");
    };

    const handleViewDecks = () => {
        console.log("Назад к колодам!");
    };

    const resetModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="guess-menu-container">
            <div className="guess-button-group">
                <Button className="guess-button" onClick={handleViewDecks}>
                    Колоды
                </Button>
                <div className="guess-separator" />
                <Button className="guess-button" onClick={() => setIsModalVisible(true)}>
                    Добавить
                </Button>
                <div className="guess-separator" />
                <Button className="guess-button" onClick={handleListDecks}>
                    Список
                </Button>
            </div>

            {isModalVisible && (
                <div className="modal-overlay">
                    <Modal
                        title="Добавление слова"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={resetModal}
                        style={{ font: "16px 'GOST Type A', cursive" }}
                    >
                        <div className="modal-containers">
                            <div className="left-container">
                                <p className="word-card-menu">Введите слово</p>
                                <Input
                                    placeholder="Слово"
                                    onChange={(e) => setWord(e.target.value)} // Исправлено
                                    size="large"
                                />
                                <p className="word-card-menu">Введите перевод</p>
                                <Input
                                    placeholder="Перевод"
                                    onChange={(e) => setTranslation(e.target.value)} // Исправлено
                                    size="large"
                                />
                                <div style={{ margin: '30px 0' }}>
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
                                        title: cardTitle || 'Название колоды',
                                    }}
                                />
                            </div>
                        </div>
                        <Button className="create-button-modal" type="primary" onClick={handleAddDeck}>Добавить</Button>
                    </Modal>
                </div>
            )}
        </div>
    );
};

CardMenuContainer.propTypes = {
    deckData: PropTypes.shape({
        coverImage: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

export default CardMenuContainer;