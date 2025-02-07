// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Search from "antd/es/input/Search.js";
import "./styles.css";
import {Pagination} from "antd";
import Book from "../../components/Book/Book.jsx";
import {useNavigate, useParams} from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const BooksPage = () => {
    const { level } = useParams();
    const navigate = useNavigate();
    const [activeLevel, setActiveLevel] = useState(level || "A1");
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);

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

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8082/books?level=${activeLevel}&page=${currentPage - 1}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data.content);
                setTotalBooks(data.totalElements);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchBooks();
    }, [activeLevel, currentPage]);

    useEffect(() => {
        setActiveLevel(level);
        setSearchTerm("");
        setCurrentPage(1);
    }, [level]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentBooks = filteredBooks.slice(0, ITEMS_PER_PAGE);

    return (
        <div className="container">
            <Sidebar />
            <div className="main-container-book">
                <div className="upper-container">
                    <Search
                        placeholder="Поиск"
                        className="search-input"
                        size="large"
                        onSearch={handleSearch}
                    />
                    <UpperMenu />
                </div>
                <div className="books-page-content">
                    <h2 className="level-title">
                        {activeLevel}: {getLevelDescription(activeLevel)}
                    </h2>
                    <div className="books-grid">
                        {currentBooks.map((book) => (
                            <Book key={book.bookId} bookData={book} onClick={() => handleBookClick(book.bookId)} />
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

export default BooksPage;