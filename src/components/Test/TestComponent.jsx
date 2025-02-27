// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css';
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

// eslint-disable-next-line react/prop-types
const TestComponent = ({currentLevel, topicId}) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchTestAndQuestions = async () => {
            try {
                const testResponse = await axiosInstance.get(`http://localhost:8083/tests/lessons/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const testId = testResponse.data.testId;

                const questionsResponse = await axiosInstance.get(`http://localhost:8083/questions/tests/${testId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const questionsWithAnswers = await Promise.all(
                    questionsResponse.data.map(async (question) => {
                        const answersResponse = await axiosInstance.get(`http://localhost:8083/answer-options/questions/${question.questionId}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                        return {...question, answers: answersResponse.data};
                    })
                );

                const numQuestions = Math.min(questionsWithAnswers.length, 5);
                setSelectedQuestions(getRandomQuestions(questionsWithAnswers, numQuestions));
                setSelectedAnswers(Array(numQuestions).fill(null));

            } catch (error) {
                console.error("Error fetching test or questions", error);
            }
        };

        fetchTestAndQuestions();
    }, [topicId, accessToken]);

    const getRandomQuestions = (arr, n) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    const checkAnswers = async () => {
        let correctAnswers = 0;
        selectedQuestions.forEach((question, index) => {
            const selectedAnswerIndex = question.answers.findIndex(option => option.text === selectedAnswers[index]);
            if (selectedAnswerIndex !== -1 && question.answers[selectedAnswerIndex].isCorrect) {
                correctAnswers++;
            }
        });
        const percentage = (correctAnswers / selectedQuestions.length) * 100;
        setTestPassed(percentage >= 60);
        setShowAnswers(true);

        // // Создание результата теста
        // const userTestResultDTO = {
        //     score: percentage,
        //     passed: false
        // };
        //
        // try {
        //     await axios.post(`http://localhost:8083/user-test-results/lessons/${topicId}`, userTestResultDTO, {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`
        //         }
        //     });
        // } catch (error) {
        //     console.error("Error creating user test result", error);
        // }
    };

    const handleNext = async () => {
        try {
            await axiosInstance.post(`http://localhost:8083/user-test-results/lessons/${topicId}/mark-passed`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate(`/grammar/${currentLevel}`);
        } catch (error) {
            console.error("Error marking test as passed", error);
        }
    };

    const resetTest = () => {
        setShowAnswers(false);
        setTestPassed(false);
        setSelectedQuestions(getRandomQuestions(selectedQuestions, selectedQuestions.length));
        setSelectedAnswers(Array(selectedQuestions.length).fill(null));
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[index] = value;
        setSelectedAnswers(newAnswers);
    };

    return (
        <div className="article-container">
            {selectedQuestions.map((question, index) => (
                <div key={index}>
                    <h3>{question.text}</h3>
                    <ul>
                        {question.answers.map((option, optionIndex) => (
                            <li key={optionIndex}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        id={`answer-${index}-${optionIndex}`}
                                        value={option.text}
                                        checked={selectedAnswers[index] === option.text}
                                        onChange={() => handleAnswerChange(index, option.text)}
                                        disabled={showAnswers}
                                    />
                                    {option.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                    {showAnswers && (
                        <p>
                            Правильный ответ: {question.answers.find(opt => opt.isCorrect)?.text}
                        </p>
                    )}
                </div>
            ))}
            <div className="test-button-container">
                <Button type="primary" size="large"
                        onClick={showAnswers ? (testPassed ? handleNext : resetTest) : checkAnswers}
                        style={{margin: '20px auto'}}>
                    {showAnswers && testPassed ? 'Next' : showAnswers ? 'Пройти еще раз' : 'Проверить'}
                </Button>
            </div>
        </div>
    );
};

export default TestComponent;