// eslint-disable-next-line no-unused-vars
import React from "react";
import "./styles.css";
import PropTypes from "prop-types";

const Word = ({ wordData }) => {
    return (
        <div className="word-card">
            {wordData && (
                <>
                    <div
                        className="word-cover"
                        style={{
                            backgroundImage: `url(${wordData.image})`, // Используем image из deckData
                            borderRadius: "18px"
                        }}
                    />
                    <div className="word-info">
                        <h3 className="title">{wordData.word}</h3> {/* Используем word из deckData */}
                    </div>
                </>
            )}
        </div>
    );
};

Word.propTypes = {
    wordData: PropTypes.shape({
        image: PropTypes.string.isRequired,
        word: PropTypes.string.isRequired,
    }).isRequired,
};

export default Word;