// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button } from '@mui/base';
import './styles.css'; // Импортируем стили, если это необходимо

const handleAddDeck = () => {
    console.log("Добавить колоду!");
};

const handleListDecks = () => {
    console.log("Список колод!");
};

const handleViewDecks = () => {
    console.log("Назад к колодам!");
};

const CardMenuContainer = () => {
    return (
        <div className="guess-menu-container">
            <div className="guess-button-group">
                <Button className="guess-button" onClick={handleViewDecks}>
                    Колоды
                </Button>
                <div className="guess-separator" />
                <Button className="guess-button" onClick={handleAddDeck}>
                    Добавить
                </Button>
                <div className="guess-separator" />
                <Button className="guess-button" onClick={handleListDecks}>
                    Список
                </Button>
            </div>
        </div>
    );
};

export default CardMenuContainer;