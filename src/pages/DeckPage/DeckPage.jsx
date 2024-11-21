// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import './styles.css'
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {Button} from "@mui/base";

const mockDecks = [
    { id: 1, title: "Животные", newItems: 10, learning: 5, repeatable: 15 }
];

const DeckPage = () => {
    // Устанавливаем начальное состояние с использованием данных из mockDecks
    const [selectedDeck] = useState(mockDecks[0]); // Выбираем первую колоду по умолчанию
    const { title: deckTitle, newItems, learning, repeatable } = selectedDeck;

    // useEffect(() => {
    //     const fetchDeckData = async () => {
    //         try {
    //             // Замените URL ниже на ваш фактический API endpoint
    //             const response = await fetch('/api/decks/1'); // Здесь нужно указать соответствующий путь
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const deckData = await response.json();
    //             setSelectedDeck(deckData);
    //         } catch (error) {
    //             console.error('Ошибка при получении данных:', error);
    //         } finally {
    //             setLoading(false); // Устанавливаем состояние загрузки в false после запроса
    //         }
    //     };
    //
    //     fetchDeckData();
    // }, []);

    const handleAddDeck = () => {
        console.log("Добавить колоду!");
    };

    const handleListDecks = () => {
        console.log("Список колод!");
    };

    const handleViewDecks = () => {
        console.log("Назад к колодам!");
    };

    return (
        <div className="deck-page">
            <Sidebar />
            <div className="deck-main">
                <div className="deck-upper-content">
                    <UpperMenu />
                </div>
                <div className="deck-container">
                    <h1 className="deck-title">{deckTitle}</h1>
                    <div className="card-container-with-stats">
                        <div className="card-deck-stats-container1">
                            <div className="card-menu-container">
                                <div className="card-button-group">
                                    <Button className="deck-button" onClick={handleViewDecks}>
                                        Колоды
                                    </Button>
                                    <div className="card-separator" />
                                    <Button className="deck-button" onClick={handleAddDeck}>
                                        Добавить
                                    </Button>
                                    <div className="card-separator" />
                                    <Button className="deck-button" onClick={handleListDecks}>
                                        Список
                                    </Button>
                                </div>
                            </div>
                            <div className="card-deck-stats-container">
                                <div className="learning-status-container">
                                    <div className="status-panel">
                                        <div className="new-items-container">
                                            <p className="category-label-text-style">Новые:</p>
                                        </div>
                                        <div className="vertical-number-container">
                                            <p className="blue-heading">{newItems}</p>
                                        </div>
                                    </div>
                                    <div className="horizontal-list-with-labels">
                                        <div className="vertical-flex-container">
                                            <p className="category-label-text-style">Изучаемые:</p>
                                        </div>
                                        <div className="vertical-centered-column">
                                            <p className="fiery-heading">{learning}</p>
                                        </div>
                                    </div>
                                    <div className="horizontal-list-container">
                                        <div className="column-flex-container">
                                            <p className="category-label-text-style">Повторяемые:</p>
                                        </div>
                                        <div className="repeatable-number-container">
                                            <p className="green-heading">{repeatable}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="learning-button-container">
                                    <Button className="learn-button-style">Учить</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeckPage;