// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {Input, Modal, Pagination} from "antd";
import Search from "antd/es/input/Search.js";
import {useNavigate} from "react-router-dom";
import Deck from "../../components/Deck/Deck.jsx";
import {Button} from "@mui/base";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const ITEMS_PER_PAGE = 15;

const Dictionary = () => {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cardTitle, setCardTitle] = useState('');
    const [image, setImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const [deckWordsCount, setDeckWordsCount] = useState({});
    const [totalDecks, setTotalDecks] = useState(0);

    useEffect(() => {
        fetchDecks();
    }, [currentPage]);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeckClick = (deckId) => {
        navigate(`/decks/${deckId}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filteredDecks = decks.filter(deck =>
        deck.deckName && deck.deckName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=DECKS&file=${coverImage}`;
    };

    const getDeckWordsCount = (deckId) => {
        return deckWordsCount[deckId] || 0;
    };

    const handleCreate = async () => {
        const formData = new FormData();
        formData.append("name", cardTitle);

        if (image) {
            formData.append("file", image);
        } else {
            const defaultImageUrl = 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5';
            const response = await fetch(defaultImageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'default-image.png', {type: 'image/png'});
            formData.append("file", file);
        }

        try {
            const response = await axiosInstance.post(`http://localhost:8081/decks`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            fetchDecks();
        } catch (error) {
            console.error("Error creating deck", error);
        }
        resetModal();
    };

    const handleDeleteDeck = async (deckId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту колоду?')) {
            try {
                await axiosInstance.delete(`http://localhost:8081/decks/${deckId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                fetchDecks();
            } catch (error) {
                console.error("Error deleting deck", error);
            }
        }
    };

    const resetModal = () => {
        setCardTitle('');
        setImage(null);
        setCoverImageUrl(null);
        setIsModalVisible(false);
    };

    const currentDecks = filteredDecks.slice(0, ITEMS_PER_PAGE);

    return (
        <div className="container">
            <Sidebar/>
            <div className="main-container-book">
                <div className="upper-container">
                    <Search
                        placeholder="Поиск"
                        className="dictionary-search"
                        size="large"
                        onSearch={handleSearch}
                    />
                    <UpperMenu/>
                </div>
                <div className="dictionary-content">
                    <h2 className="level-title">Ваши колоды:</h2>
                    <div className="decks-grid">
                        {currentDecks.map((deck) => (
                            <Deck
                                key={deck.deckId}
                                deckData={{
                                    coverImage: getCoverImageUrl(deck.deckPhoto),
                                    deckName: deck.deckName,
                                    author: getDeckWordsCount(deck.deckId),
                                }}
                                onClick={() => handleDeckClick(deck.deckId)}
                                onDelete={() => handleDeleteDeck(deck.deckId)}
                            />
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={totalDecks}
                            showSizeChanger={false}
                            pageSize={ITEMS_PER_PAGE}
                        />
                        <Button className="create-button" onClick={() => setIsModalVisible(true)}>Создать</Button>
                    </div>
                </div>
            </div>

            {isModalVisible && (
                <div className="modal-overlay">
                    <Modal
                        title="Создание колоды"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={resetModal}
                        style={{font: "16px 'GOST Type A', cursive"}}
                    >
                        <div className="modal-containers">
                        <div className="left-container">
                                <Input
                                    placeholder="Название колоды"
                                    value={cardTitle}
                                    onChange={(e) => setCardTitle(e.target.value)}
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
                                <Deck
                                    deckData={{
                                        coverImage: coverImageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
                                        deckName: cardTitle || 'Название колоды',
                                        author: '0 слов',
                                    }}
                                />
                            </div>
                        </div>
                        <Button className="create-button-modal" type="primary" onClick={handleCreate}>Создать</Button>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Dictionary;