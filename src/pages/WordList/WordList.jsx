// eslint-disable-next-line no-unused-vars
import React, {useCallback, useEffect, useState} from "react";
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import CardMenuContainer from "../../components/CardMenuContainer/CardMenuContainer.jsx";
import {Button, Input, Modal} from "antd";
import {useParams} from "react-router-dom";
import Word from "../../components/Word/Word.jsx";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const WordList = () => {
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [words, setWords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentWordId, setCurrentWordId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const accessToken = localStorage.getItem('accessToken');
    const {deckId} = useParams();
    const [image, setImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(null);

    const fetchDeck = useCallback(async () => {
        try {
            const deckResponse = await axiosInstance.get(`http://localhost:8081/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSelectedDeck(deckResponse.data);

            const wordsResponse = await axiosInstance.get(`http://localhost:8081/word-progress/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setWords(wordsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [deckId, accessToken]);

    useEffect(() => {
        fetchDeck();
    }, [fetchDeck, deckId, accessToken]);

    const resetModal = () => {
        setIsModalVisible(false);
        setWord('');
        setTranslation('');
        setImageUrl(null);
        setCurrentWordId(null);
        setImage(null);
        setCoverImageUrl(null);
    };

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=WORDS&file=${coverImage}`;
    };

    const openEditModal = (item) => {
        setCurrentWordId(item.word.wordId);
        setWord(item.word.commonWord.wordName);
        setTranslation(item.word.wordTranslation ? item.word.wordTranslation : item.word.commonWord.wordTranslation);
        setImageUrl(getCoverImageUrl(item.word.wordPhoto));
        setIsModalVisible(true);
    };

    const handleUpdateWord = async () => {
        if (currentWordId !== null) {
            const formData = new FormData();

            const updatedWordDTO = {
                wordId: currentWordId,
            };

            if (translation !== null && translation !== '') {
                updatedWordDTO.wordTranslation = translation;
            }

            if (image) {
                formData.append('file', image);
            }

            formData.append('wordDTO', new Blob([JSON.stringify(updatedWordDTO)], {
                type: 'application/json',
            }));

            try {
                await axiosInstance.put(`http://localhost:8081/words/${currentWordId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data', // Указываем тип контента
                    },
                });

                await fetchDeck();
                resetModal();
            } catch (error) {
                console.error('Error updating word:', error);
            }
        }
    };

    const handleDeleteWord = async (wordProgressId) => {
        try {
            await axiosInstance.delete(`http://localhost:8081/word-progress/${wordProgressId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setWords(words.filter(word => word.wordProgressId !== wordProgressId));
        } catch (error) {
            console.error('Ошибка при удалении слова:', error);
        }
    };

    if (!selectedDeck) {
        return <div>Loading...</div>;
    }

    return (
        <div className="word-list-page">
            <Sidebar/>
            <div className="word-list-main">
                <div className="word-list-upper-content">
                    <UpperMenu/>
                </div>
                <div className="word-list-container">
                    <h1 className="word-list-title">{selectedDeck.deckName}</h1>
                    <div className="word-list-container-with-stats">
                        <div className="word-list-stats-container1">
                            <CardMenuContainer deckData={{
                                coverImage: getCoverImageUrl(selectedDeck.deckPhoto),
                                deckName: selectedDeck.deckName,
                                id: selectedDeck.deckId,
                            }}/>
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
                                    {words.map((item) => (
                                        <div key={item.wordProgressId} className="flex-row-with-buttons">
                                            <div className="flex-container-with-buttons">
                                                <p className="animal-title">{item.word.commonWord.wordName}</p>
                                            </div>
                                            <div className="flex-container-with-buttons">
                                                <p className="animal-title-text-style">
                                                    {item.word.wordTranslation ? item.word.wordTranslation : item.word.commonWord.wordTranslation}
                                                </p>
                                            </div>
                                            <p className="animal-title-text-style">
                                                {item.nextReviewDate && new Intl.DateTimeFormat('ru-RU').format(new Date(item.nextReviewDate))}
                                            </p>
                                            <div className="flex-container-with-buttons">
                                                <Button className="button-style-primary"
                                                        onClick={() => openEditModal(item)}>Изменить</Button>
                                                <Button
                                                    className="action-button"
                                                    onClick={() => handleDeleteWord(item.wordProgressId)}
                                                >
                                                    Удалить
                                                </Button>
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
                                <p className="word-card-menu">Слово</p>
                                <Input
                                    value={word}
                                    placeholder="Слово"
                                    readOnly
                                    size="large"
                                />
                                <p className="word-card-menu">Введите перевод</p>
                                <Input
                                    value={translation}
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
                                        image: coverImageUrl || imageUrl,
                                        word: word || 'Слово',
                                    }}
                                />
                            </div>
                        </div>
                        <Button className="create-button-modal" type="primary"
                                onClick={handleUpdateWord}>Изменить</Button>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default WordList;