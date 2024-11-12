// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Search from "antd/es/input/Search.js";
import "./styles.css";
import {Pagination} from "antd";
import Book from "../../components/Book/Book.jsx";
import {useParams} from "react-router-dom";

const BooksPage = () => {
    const { level } = useParams();
    const [activeLevel, setActiveLevel] = useState(level || "A1");
    const [books] = useState([
        {
            id: 1,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 1",
            author: "Автор книги 1"
        },
        {
            id: 2,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 2",
            author: "Автор книги 2"
        },
        {
            id: 3,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 3",
            author: "Автор книги 3"
        },
        {
            id: 4,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 4",
            author: "Автор книги 4"
        },
        {
            id: 5,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 5",
            author: "Автор книги 5"
        },
        {
            id: 6,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 6",
            author: "Автор книги 6"
        },
        {
            id: 7,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 7",
            author: "Автор книги 7"
        },
        {
            id: 8,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 8",
            author: "Автор книги 8"
        },
        {
            id: 9,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 9",
            author: "Автор книги 9"
        },
        {
            id: 10,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 10",
            author: "Автор книги 10"
        },
    ]);
    const getLevelDescription = (level) => {
        switch (level) {
            case 'A1':
                return 'Elementary';
            case 'A2':
                return 'Pre-intermediate';
            case 'B1':
                return 'Intermediate';
            case 'B2':
                return 'Upper-intermediate';
            case 'C1':
                return 'Advanced';
            case 'C2':
                return 'Proficiency';
            default:
                return '';
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(5); // Заглушка для totalPages

    useEffect(() => {
        // Заглушка для fetchBooks
        // const fetchBooks = async () => {
        //   try {
        //     const response = await fetch(`/api/books?level=${activeLevel}&page=${currentPage}`);
        //     const data = await response.json();
        //     setBooks(data.books);
        //     setTotalPages(data.totalPages);
        //   } catch (error) {
        //     console.error("Ошибка при получении данных:", error);
        //   }
        // };
        // fetchBooks();
    }, [activeLevel, currentPage]);

    useEffect(() => {
        setActiveLevel(level); // Обновляем activeLevel при изменении level
    }, [level]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <Sidebar/>
            <div className="main-container-book">
                <div className="upper-container">
                    <Search
                        placeholder="Search"
                        // onSearch={onSearch}
                        style={{
                            width: 472
                        }}
                        size="large"
                    />
                    <UpperMenu/>
                </div>
                <div className="content">
                    <h2 className="level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <div className="books-grid">
                        {books.map((book) => (
                            <Book key={book.id} bookData={book}/>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={totalPages * 10}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksPage;