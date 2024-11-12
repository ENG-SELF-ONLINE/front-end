// eslint-disable-next-line no-unused-vars
import React from "react";
import "./styles.css";
import PropTypes from "prop-types";

const Book = ({ bookData }) => {
    // bookData - это объект, который передается из BooksPage

    return (
        <div className="book-card">
            {bookData && (
                <>
                    <div
                        className="cover"
                        style={{
                            backgroundImage: `url(${bookData.coverImage})`,
                            borderRadius: "18px"
                        }}
                    />
                    <div className="book-info">
                        <h3 className="title">{bookData.title}</h3>
                        <p className="author">{bookData.author}</p>
                    </div>
                </>
            )}
        </div>
    );
};

Book.propTypes = {
    bookData: PropTypes.shape({
        coverImage: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
    }).isRequired,
};

export default Book;