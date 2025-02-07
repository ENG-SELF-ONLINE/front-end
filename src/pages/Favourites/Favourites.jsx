// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import Book from "../../components/Book/Book.jsx";
import { Pagination } from "antd";
import Search from "antd/es/input/Search.js";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Favourites = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await fetch(`http://localhost:8082/favourites`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data.content);

            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };

        fetchFavourites();
    }, [accessToken]);

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
        book.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalBooks = filteredBooks.length;
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
                <div className="favourites-content">
                    <h2 className="level-title">
                        Список избранных книг:
                    </h2>
                    <div className="books-grid-favourites">
                        {currentBooks.map((book) => (
                            <Book key={book.id} bookData={book.book} onClick={() => handleBookClick(book.book.bookId)} />
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