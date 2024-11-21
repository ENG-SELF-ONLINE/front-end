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

const Dictionary = () => {
    const navigate = useNavigate(); // Инициализация navigate
    const [decks] = useState([
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
            title: "Животные",
            author: "24 слова"
        },
        {
            id: 15,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Животные",
            author: "24 слова"
        },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(5); // Заглушка для totalPages
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cardTitle, setCardTitle] = useState('');
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Заглушка для fetchBooks
        // const fetchBooks = async () => {
        //   try {
        //     const response = await fetch(`/api/favourites&page=${currentPage}`);
        //     const data = await response.json();
        //     setBooks(data.books);
        //     setTotalPages(data.totalPages);
        //   } catch (error) {
        //     console.error("Ошибка при получении данных:", error);
        //   }
        // };
        // fetchBooks();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBookClick = (deckId) => {
        console.log('clicked');
        navigate(`/decks/${deckId}`); // Используйте navigate для перехода на страницу
    };

    const handleCreate = () => {
        console.log('Create deck:', cardTitle, imageUrl);
        // Логика для создания колоды
        // После создания можно закрыть модал
        resetModal();
    };

    const resetModal = () => {
        setCardTitle('');
        setImageUrl(null);
        setIsModalVisible(false);
    };


    return (
        <div className="container">
            <Sidebar />
            <div className="main-container-book">
                <div className="upper-container">
                    <Search placeholder="Search" style={{ width: 472 }} size="large" />
                    <UpperMenu />
                </div>
                <div className="content">
                    <h2 className="level-title">Ваши колоды:</h2>
                    <div className="decks-grid">
                        {decks.map((deck) => (
                            <Deck key={deck.id} deckData={deck} onClick={() => handleBookClick(deck.id)} />
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={totalPages * 10}
                            showSizeChanger={false}
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
                                {/* Передаем данные Deck */}
                                <Deck
                                    deckData={{
                                        coverImage: imageUrl || 'https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5', // Используем imageUrl или пустую строку
                                        title: cardTitle || 'Название колоды', // Используем cardTitle или запасное имя
                                        author: '0 слов', // Замените на реальный автор, если необходимо
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