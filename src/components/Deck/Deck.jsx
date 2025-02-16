// eslint-disable-next-line no-unused-vars
import React from "react";
import "./styles.css";
import PropTypes from "prop-types";

const Deck = ({ deckData, onClick }) => {

    return (
        <div className="deck-card" onClick={onClick}>
            {deckData && (
                <>
                    <div
                        className="deck-cover"
                        style={{
                            backgroundImage: `url(${deckData.coverImage})`,
                            borderRadius: "18px"
                        }}
                    />
                    <div className="deck-info">
                        <h3 className="deckName">{deckData.deckName}</h3>
                        <p className="author">{deckData.author}</p>
                    </div>
                </>
            )}
        </div>
    );
};

Deck.propTypes = {
    deckData: PropTypes.shape({
        coverImage: PropTypes.string.isRequired,
        deckName: PropTypes.string.isRequired,
        author: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    onClick: PropTypes.func,
};

export default Deck;