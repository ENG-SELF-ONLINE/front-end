// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import './styles.css'
import {Button} from "@mui/base";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import heart from './images/heart.png';
import download from './images/download.png';

const BookInfoPage = () => {
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Задаем заглушки для данных книги
        const mockBookData = {
            title: "Brothers in Arms",
            author: "Julie Reeves",
            genre: "fantasy",
            description: "The life of teenagers in high school is a difficult period. This is that age when you make lots of observations. Ordinary things look suspicious. One can think that this is only rich\n" +
                "            imagination and a difficult transitional age. But if it is not so? If there are really odities? Why aren&apos;t students at Mangrove High School allowed to use computers? Why is it\n" +
                "            forbidden to study maths? Why are there guards in the school who watch children all the time? Everything is very strange. Even thoughts can be overheard by someone. Finn and Ellie want to\n" +
                "            understand what&apos;s wrong and ask questions. And their lives are turned upside down. Suddenly even their families are no longer what they seemed. Who can they trust now?",
            coverImage: "https://cdn.culture.ru/images/313ee15f-c840-5488-a7b0-7d48547cf8b5", // Заглушка для изображения обложки
            downloads: 123,
            likes: 45,
            hardWords: "sleepyhead, sounded, pushed, judged, wondering, attacked, avoided, parents, gasping, maths, smelling, liked, grey, moved, passed, hurting, staying, carried, discovered, brushed, worked,\n" +
                "          rested, terminated, parted, staring, rushed, joking, unkindly, lit, kept."
        };

        // Имитируем загрузку данных
        setTimeout(() => {
            setBookData(mockBookData);
            setLoading(false);
        }, 1000); // Задержка в 1 секунду для имитации загрузки
    }, []);

    const handleDownloadComplete = () => {
        console.log('Download completed');
        // Добавьте логику для обработки завершения загрузки
    };

    const handleCompleted = () => {
        console.log('Completed');
        // Добавьте логику для обработки завершения загрузки
    };

    const handleCancel = () => {
        console.log('Download canceled');
        // Добавьте логику для обработки отмены загрузки
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        ); // Кружок загрузки во время загрузки данных
    }

    return (
        <div className={'book-info-page'}>
            <Sidebar/>
            <div className="book-main-info">
                <div className="book-info-upper-content">
                    <UpperMenu/>
                </div>
                <div className="story-container1">
                    <div className="story-container">
                        <div className="card-container1">
                            <img src={bookData.coverImage}
                                 alt="Book Cover"
                                 className="image-container-with-text"/>
                            <div className="numeric-info-container">
                                <div className="flex-row-container">
                                    <img src={download} className="image-with-text-overlay2" alt="Downloads"/>
                                    <p className="number-text-divider">{bookData.downloads}</p>
                                </div>
                                <div className="flex-row-container">
                                    <img src={heart} className="image-with-text-overlay1" alt="Likes"/>
                                    <p className="number-text-divider">{bookData.likes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="story-card-container">
                            <div className="story-container3">
                                <div className="fantasy-card-with-title">
                                    <p className="epic-title-text-style">{bookData.title}</p>
                                    <div className="fantasy-container">
                                        <img src={heart} className="fantasy-image-style" alt="Genre"/>
                                        <p className="fantasy-title">{bookData.genre}</p>
                                    </div>
                                </div>
                                <p className="author-name-text-style">{bookData.author}</p>
                            </div>
                            <p className="narrative-text-style">
                                {bookData.description}
                            </p>
                        </div>
                    </div>
                    <p className="book-summary-text-style">
                        <span className="strong-emphasis-text-style">Hard words:</span>
                        <span>{" "}{bookData.hardWords}</span>
                    </p>
                    <div className="download-section2">
                        <div className="flex-row-container">
                            <Button className="download-button-style" onClick={handleDownloadComplete}>Download</Button>
                        </div>
                        <div className="download-section">
                            <Button className="completed-button-style" onClick={handleCompleted}>Completed</Button>
                            <Button className="cancel-button-style" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookInfoPage;
