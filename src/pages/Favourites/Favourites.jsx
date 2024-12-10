// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Book from "../../components/Book/Book.jsx";
import {Pagination} from "antd";
import Search from "antd/es/input/Search.js";
import {useNavigate} from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Favourites = () => {
    const navigate = useNavigate();
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
        {
            id: 11,
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5",
            title: "Название книги 11",
            author: "Автор книги 11"
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    // const searchBooks = async (query) => {
    //     const response = await fetch(`/api/books/search?query=${query}`);
    //     const data = await response.json();
    //     return data; // предполагается, что данные - это массив книг
    // };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Сброс текущей страницы при новом поиске
    };

    // Фильтрация книг по поисковому запросу
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Вычисляем индексы для текущей страницы
    const totalBooks = filteredBooks.length;

    // Вычисляем книги, которые нужно отображать на текущей странице
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    return (
        <div className="container">
            <Sidebar/>
            <div className="main-container-book">
                <div className="upper-container">
                    <Search
                        placeholder="Поиск"
                        style={{
                            width: 472
                        }}
                        size="large"
                        onSearch={handleSearch}
                    />
                    <UpperMenu/>
                </div>
                <div className="content">
                    <h2 className="level-title">
                        Список избранных книг:
                    </h2>
                    <div className="books-grid-favourites">
                        {currentBooks.map((book) => (
                            <Book key={book.id} bookData={book} onClick={() => handleBookClick(book.id)}/>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={totalBooks}
                            showSizeChanger={false}
                            pageSize={ITEMS_PER_PAGE}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favourites;