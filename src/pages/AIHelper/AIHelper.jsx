// eslint-disable-next-line no-unused-vars
import React, {useRef, useState} from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {Button, Input} from 'antd';
import {AudioOutlined, SendOutlined, StopOutlined} from '@ant-design/icons';

const AIHelper = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('Следующее');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [language] = useState('en');
    const [aiMessageTitle, setAiMessageTitle] = useState('');

    const handleSendText = async () => {
        if (inputText.trim() === '') return;
        const userMessage = inputText;
        setMessages(prevMessages => [
            ...prevMessages,
            {type: 'user', text: userMessage}
        ]);
        setInputText('Следующее');

        await getNextSample();
    };

    const getNextSample = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/getSample', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: 1,
                    language: 'en'
                })
            });
            const data = await response.json();
            const aiMessage = data.real_transcript;
            setAiMessageTitle(aiMessage);
            setMessages(prevMessages => [
                ...prevMessages,
                {type: 'ai', text: aiMessage}
            ]);
        } catch (error) {
            console.error('Error getting next sample:', error);
        }
    };

    const handleStartRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = async (event) => {
            const audioBlob = event.data;
            await sendAudio(audioBlob);
        };

        mediaRecorderRef.current.start();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    };

    const sendAudio = async (audioBlob) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioBlob);
        reader.onloadend = async () => {
            const audioBuffer = reader.result;
            const base64Audio = `data:audio/ogg;;base64,${btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))}`;

            const payload = {
                base64Audio,
                language: language,
                title: aiMessageTitle
            };

            try {
                const response = await fetch('http://127.0.0.1:3000/GetAccuracyFromRecordedAudio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                displayResults(data);
            } catch (error) {
                console.error('Error sending audio:', error);
            }
        };
    };

    const displayResults = (data) => {
        const userTranscript = data.real_transcript;
        const aiTranscript = data.real_transcripts;
        const pronunciationAccuracy = data.pronunciation_accuracy;

        setMessages(prevMessages => [
            ...prevMessages,
            {type: 'user', text: <>{userTranscript}</>},
        ]);

        setMessages(prevMessages => [
            ...prevMessages,
            {type: 'ai', text: compareTranscripts(userTranscript, aiTranscript)},
            {type: 'ai', text: `Точность произношения: ${pronunciationAccuracy}%`}
        ]);
    };

    const compareTranscripts = (userTranscript, aiTranscript) => {
        if (typeof userTranscript !== 'string' || typeof aiTranscript !== 'string') {
            return null;
        }

        const userWords = userTranscript.trim().toLowerCase().split(' ');
        const aiWords = aiTranscript.trim().toLowerCase().split(' ');
        const highlightedWords = [];
        let userIndex = 0;
        let aiIndex = 0;

        while (userIndex < userWords.length || aiIndex < aiWords.length) {
            const userWord = userWords[userIndex] || '';
            const aiWord = aiWords[aiIndex] || '';

            if (userWord === aiWord) {
                highlightedWords.push(<span key={`${userIndex}-${aiIndex}`}>{userWords[userIndex]} </span>);
                userIndex++;
                aiIndex++;
            } else {
                if (userIndex + 1 < userWords.length && userWords[userIndex + 1] === aiWord) {
                    highlightedWords.push(
                        <span key={`${userIndex}-${aiIndex}`} style={{color: 'red'}}>{userWord} </span>,
                        <span key={`${userIndex + 1}-${aiIndex}`}>{userWords[userIndex + 1]} </span>
                    );

                    userIndex += 2;
                    aiIndex++;

                }
                else if (aiIndex + 1 < aiWords.length && userWord === aiWords[aiIndex + 1]) {
                    highlightedWords.push(
                        <span key={`${userIndex}-${aiIndex}`}>{userWord} </span>,
                        <span key={`${userIndex}-${aiIndex + 1}`} style={{color: 'red'}}>{aiWords[aiIndex + 1]} </span>
                    );
                    userIndex++;
                    aiIndex += 2;
                }
                else {
                    highlightedWords.push(
                        <span key={`${userIndex}-${aiIndex}`} style={{color: 'red'}}>{userWord} </span>,
                        <span key={`${userIndex}-${aiIndex}-correct`}
                              style={{color: 'green', textDecoration: 'underline'}}>{aiWord} </span>
                    );
                    userIndex++;
                    aiIndex++;
                }
            }
        }

        return <>{highlightedWords}</>;
    };


    return (
        <div className="helper-page">
            <Sidebar/>
            <div className="helper-main-info">
                <div className="helper-upper-content">
                    <UpperMenu/>
                </div>
                <div className="helper-main-content">
                    <h1 className="helper-title">ИИ-Тренажер</h1>
                    <div className="message-container">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <Input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Введите сообщение..."
                        />
                        <div className='button-container'>
                            <Button shape="circle" icon={<SendOutlined/>} onClick={handleSendText}/>
                            <Button shape="circle" icon={isRecording ? <StopOutlined onClick={handleStopRecording}/> :
                                <AudioOutlined onClick={handleStartRecording}/>}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHelper;