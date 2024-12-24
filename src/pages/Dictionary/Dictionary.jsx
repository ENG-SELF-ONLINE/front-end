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

const ITEMS_PER_PAGE = 15;

const Dictionary = () => {
    const navigate = useNavigate(); // Инициализация navigate
    const [decks, setDecks] = useState([
        {
            id: 1,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 2,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 3,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 4,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 5,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 6,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 7,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 8,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 9,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 10,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 11,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 12,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 13,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 14,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Грибы",
            author: "24 слова"
        },
        {
            id: 15,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 16,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cardTitle, setCardTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Заглушка для fetchBooks
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBookClick = (deckId) => {
        navigate(`/decks/${deckId}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filteredDecks = decks.filter(deck =>
        deck.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        const newDeck = {
            id: decks.length + 1, // Простой способ генерации уникального ID
            coverImage: imageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
            title: cardTitle || 'Название колоды',
            author: '0 слов'
        };

        setDecks([...decks, newDeck]); // Добавляем новую колоду в состояние
        resetModal();
    };

    const resetModal = () => {
        setCardTitle('');
        setImageUrl(null);
        setIsModalVisible(false);
    };

    const totalDecks = filteredDecks.length;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDecks = filteredDecks.slice(startIndex, endIndex);

    return (
        <div className="container">
            <Sidebar />
            <div className="main-container-book">
                <div className="upper-container">
                    <Search
                        placeholder="Поиск"
                        className="dictionary-search"
                        size="large"
                        onSearch={handleSearch}
                    />
                    <UpperMenu />
                </div>
                <div className="dictionary-content">
                    <h2 className="level-title">Ваши колоды:</h2>
                    <div className="decks-grid">
                        {currentDecks.map((deck) => (
                            <Deck key={deck.id} deckData={deck} onClick={() => handleBookClick(deck.id)} />
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

            {/* Модальное окно создания карточки */}
            {isModalVisible && (
                <div className="modal-overlay">
                    <Modal
                        title="Создание колоды"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={resetModal}
                        style={{ font: "16px 'GOST Type A', cursive" }}
                    >
                        <div className="modal-containers">
                            <div className="left-container">
                                <Input
                                    placeholder="Название колоды"
                                    value={cardTitle}
                                    onChange={(e) => setCardTitle(e.target.value)}
                                    size="large"
                                />
                                <div style={{ margin: '30px 0' }}>
                                    <Button onClick={() => {
                                        const imageUrl = prompt("Введите URL изображения:");
                                        if (imageUrl) {
                                            setImageUrl(imageUrl);
                                        }
                                    }}>Выбрать фотографию</Button>
                                </div>
                            </div>
                            <div className="right-container">
                                <Deck
                                    deckData={{
                                        coverImage: imageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5',
                                        title: cardTitle || 'Название колоды',
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