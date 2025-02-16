// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Button} from '@mui/base';
import './styles.css';
import {Input, Modal} from "antd";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import Word from "../Word/Word.jsx";
import axios from "axios";

const CardMenuContainer = ({deckData}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    const handleAddDeck = async () => {
        const wordDTO = {
            commonWord: {
                wordName: word
            },
            wordTranslation: translation
        };

        const formData = new FormData();
        formData.append("wordDTO", new Blob([JSON.stringify(wordDTO)], {type: "application/json"}));

        if (image) {
            formData.append("file", image);
        } else {
            const defaultImageUrl = 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5';
            try {
                const response = await fetch(defaultImageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'default-image.png', {type: 'image/png'});
                formData.append("file", file);
            } catch (error) {
                console.error("Error fetching default image:", error);
                return;
            }
        }

        try {
            const response = await axios.post(`http://localhost:8081/words/decks/${deckData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
        } catch (error) {
            console.error("Error creating word", error);
        }
        resetModal();
        window.location.reload()
    };

    const handleListDecks = () => {
        navigate(`/decks/${deckData.id}/words`);
    };

    const handleViewDecks = () => {
        navigate(`/dictionary`);
    };

    const resetModal = () => {
        setIsModalVisible(false);
        setImage(null);
        setCoverImageUrl(null);
    };

    return (
        <div className="guess-menu-container">
            <div className="guess-button-group">
                <Button className="guess-button" onClick={handleViewDecks}>
                    Колоды
                </Button>
                <div className="guess-separator"/>
                <Button className="guess-button" onClick={() => setIsModalVisible(true)}>
                    Добавить
                </Button>
                <div className="guess-separator"/>
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
                        style={{font: "16px 'GOST Type A', cursive"}}
                    >
                        <div className="modal-containers">
                            <div className="left-container">
                                <p className="word-card-menu">Введите слово</p>
                                <Input
                                    placeholder="Слово"
                                    onChange={(e) => setWord(e.target.value)}
                                    size="large"
                                />
                                <p className="word-card-menu">Введите перевод</p>
                                <Input
                                    placeholder="Перевод"
                                    onChange={(e) => setTranslation(e.target.value)}
                                    size="large"
                                />
                                <div style={{margin: '30px 0'}}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImage(file);
                                                setCoverImageUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                        style={{display: 'block', margin: '20px 0'}}
                                    />
                                </div>
                            </div>
                            <div className="right-container">
                                <Word
                                    wordData={{
                                        image: coverImageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
                                        word: word || 'Слово',
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
        deckName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};

export default CardMenuContainer;