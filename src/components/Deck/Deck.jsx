// eslint-disable-next-line no-unused-vars
import React from "react";
import "./styles.css";
import PropTypes from "prop-types";
import { Button, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const Deck = ({ deckData, onClick, onDelete }) => {
    return (
        <div className="deck-card">
            {deckData && (
                <>
                    <div
                        className="deck-cover"
                        style={{
                            backgroundImage: `url(${deckData.coverImage})`,
                            borderRadius: "18px",
                            position: "relative"
                        }}
                    >
                        <Tooltip title="Удалить колоду">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: 'white',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    border: 'none'
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div className="deck-info" onClick={onClick}>
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
    onDelete: PropTypes.func,
};

export default Deck;