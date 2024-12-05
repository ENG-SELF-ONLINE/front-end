// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './styles.css';
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ListeningTestComponent = ({ currentLevel }) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const navigate = useNavigate(); // Инициализация navigate

    const audioSrc = "path/to/your/audio/file.mp3"; // Замените на ваш путь к аудиофайлу

    const questions = [
        {
            question: "What did the speaker mention about their day?",
            options: ["It was boring.", "It was exciting.", "It was long."],
            answer: "It was exciting."
        },
        {
            question: "Which activity did the speaker do?",
            options: ["Went shopping", "Visited a friend", "Watched a movie"],
            answer: "Visited a friend"
        },
        {
            question: "What time did they finish their activity?",
            options: ["In the morning", "In the afternoon", "In the evening"],
            answer: "In the evening"
        },
        {
            question: "How did they feel at the end of the day?",
            options: ["Tired", "Happy", "Sad"],
            answer: "Happy"
        },
        {
            question: "What was the weather like?",
            options: ["Sunny", "Rainy", "Cloudy"],
            answer: "Sunny"
        }
    ];

    const numQuestions = 5;

    const getRandomQuestions = (arr, n) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    useEffect(() => {
        setSelectedQuestions(getRandomQuestions(questions, numQuestions));
    }, []);

    const checkAnswers = () => {
        let correctAnswers = 0;
        selectedQuestions.forEach((question, index) => {
            if (question.answer === document.querySelector(`input[name="question-${index}"]:checked`)?.value) {
                correctAnswers++;
            }
        });
        const percentage = (correctAnswers / numQuestions) * 100;
        setTestPassed(percentage >= 60);
        setShowAnswers(true);
    };

    const resetTest = () => {
        setShowAnswers(false);
        setTestPassed(false);
        setSelectedQuestions(getRandomQuestions(questions, numQuestions));
    };

    const handleNext = () => {
        navigate(`/listening/${currentLevel}`); // Переход на страницу с текущим уровнем
    };

    return (
        <div className="article-container">
            <audio controls style={{ marginBottom: '20px' }}>
                <source src={audioSrc} type="audio/mpeg" />
                Ваш браузер не поддерживает аудиоплеер.
            </audio>
            {selectedQuestions.map((question, index) => (
                <div key={index}>
                    <h3>{question.question}</h3>
                    <ul>
                        {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        id={`answer-${index}-${optionIndex}`}
                                        value={option}
                                        disabled={showAnswers}
                                    />
                                    {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                    {showAnswers && (
                        <p style={{marginBottom: '20px'}}>
                            Правильный ответ: {question.answer}
                        </p>
                    )}
                </div>
            ))}
            <div className="test-button-container">
                <Button type="primary" size="large" onClick={showAnswers ? (testPassed ? handleNext : resetTest) : checkAnswers} style={{ margin: '20px auto' }}>
                    {showAnswers && testPassed ? 'Next' : showAnswers ? 'Пройти еще раз' : 'Проверить'}
                </Button>
            </div>
        </div>
    );
};

export default ListeningTestComponent;