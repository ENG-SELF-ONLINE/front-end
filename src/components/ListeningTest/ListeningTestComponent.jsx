// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css';
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

// eslint-disable-next-line react/prop-types
const ListeningTestComponent = ({currentLevel, topicId}) => {
    const [showAnswers, setShowAnswers] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [audioSrc, setAudioSrc] = useState('');
    const navigate = useNavigate();
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestAndQuestions = async () => {
            try {
                setIsLoading(true);
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

                const lessonMaterialsResponse = await axiosInstance.get(`http://localhost:8083/lesson-materials/lessons/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const content = JSON.parse(lessonMaterialsResponse.data.content);
                const audioContent = content.content.find(item => item.type === "audio");
                if (audioContent && audioContent.audioSrc) {
                    const generatedAudioSrc = `http://localhost:9999/files/audios/show?file=${encodeURIComponent(audioContent.audioSrc)}&bucket=AUDIOS`;
                    setAudioSrc(generatedAudioSrc);
                }

            } catch (error) {
                console.error("Error fetching test or questions", error);
            } finally {
                setIsLoading(false);
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
            navigate(`/listening/${currentLevel}`);
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
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                audioSrc && (
                    <audio controls style={{marginBottom: '20px'}}>
                        <source src={audioSrc} type="audio/mpeg"/>
                        Ваш браузер не поддерживает аудиоплеер.
                    </audio>
                )
            )}
            {selectedQuestions.length > 0 ? (
                selectedQuestions.map((question, index) => (
                    <div key={index}>
                        <h3>{question.text}</h3> {/* Display the question text */}
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
                            <p style={{marginBottom: '20px'}}>
                                Правильный ответ: {question.answers.find(a => a.isCorrect)?.text}
                            </p>
                        )}
                    </div>
                ))
            ) : null}
            <div className="test-button-container">
                <Button
                    type="primary"
                    size="large"
                    onClick={showAnswers ? (testPassed ? handleNext : resetTest) : checkAnswers}
                    style={{margin: '20px auto'}}
                >
                    {showAnswers && testPassed ? 'Далее' : showAnswers ? 'Пройти еще раз' : 'Проверить'}
                </Button>
            </div>
        </div>
    );
};

export default ListeningTestComponent;