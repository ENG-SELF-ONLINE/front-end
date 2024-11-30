// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './styles.css';
import { Button } from "antd";
import {useNavigate} from "react-router-dom";

const TestComponent = () => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const navigate = useNavigate(); // Инициализация navigate

    const questions = [
        {
            question: "What is the past tense of 'go'?",
            options: ["goed", "gone", "went"],
            answer: "went"
        },
        {
            question: "Which of the following is a regular verb?",
            options: ["eat", "run", "walk", "drink"],
            answer: "walk"
        },
        {
            question: "What is the present participle of 'work'?",
            options: ["working", "worked", "work", "works"],
            answer: "working"
        },
        {
            question: "Choose the correct past participle of 'swim'.",
            options: ["swam", "swimming", "swum", "swimmed"],
            answer: "swum"
        },
        {
            question: "Which sentence uses the present simple tense correctly?",
            options: ["I am go to the shop.", "I goes to the shop.", "I go to the shop.", "I went to the shop."],
            answer: "I go to the shop."
        },
        {
            question: "What is the future simple tense of 'play'?",
            options: ["will playing", "will play", "playing", "played"],
            answer: "will play"
        },
        {
            question: "What is the past perfect tense of 'eat'?",
            options: ["had eaten", "ate", "has eaten", "have eaten"],
            answer: "had eaten"
        },
        {
            question: "What is the future perfect tense of 'see'?",
            options: ["will have seen", "will seen", "will be seen", "have seen"],
            answer: "will have seen"
        },
        {
            question: "What is the present perfect tense of 'read'?",
            options: ["read", "have read", "has reading", "had read"],
            answer: "have read"
        },
        {
            question: "Which sentence correctly uses the past continuous tense?",
            options: ["I was playing football.", "I played football.", "I am playing football.", "I play football."],
            answer: "I was playing football."
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
        navigate('/grammar/A1'); // Переход на страницу /grammar/A1
    };

    return (
        <div className="article-container">
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
                        <p>
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

export default TestComponent;