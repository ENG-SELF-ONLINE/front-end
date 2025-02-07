// eslint-disable-next-line no-unused-vars
import React from "react";
import "./styles.css";
import PropTypes from "prop-types";

const Book = ({ bookData, onClick }) => {

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=COVERS&file=${coverImage}`;
    };

    return (
        <div className="book-card" onClick={onClick}>
            {bookData && (
                <>
                    <div
                        className="cover"
                        style={{
                            backgroundImage: `url(${bookData.coverImage ? getCoverImageUrl(bookData.coverImage) : ''})`,
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
    onClick: PropTypes.func.isRequired,
};

export default Book;