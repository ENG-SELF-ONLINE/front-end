// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';
import './styles.css';
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import { Button, Input } from 'antd';
import { SendOutlined, StopOutlined, AudioOutlined } from '@ant-design/icons';

const AIHelper = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recording = useRef(null);

    const handleSendText = () => {
        if (inputText.trim() === '') return;
        setMessages(prevMessages => [
            ...prevMessages,
            { type: 'user', text: inputText }
        ]);
        setInputText('');
        simulateAIResponse();
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        console.log("Start recording");
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        console.log("Stop recording");
        simulateAIResponse();
    };

    const simulateAIResponse = () => {
        setTimeout(() => {
            const aiMessage = { type: 'ai', text: 'Это ответ AI-бота!' };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        }, 500);
    };

    return (
        <div className="helper-page">
            <Sidebar />
            <div className="helper-main-info">
                <div className="helper-upper-content">
                    <UpperMenu />
                </div>
                <div className="helper-main-content">
                    <h1 className="helper-title">AI Helper</h1>
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
                            <Button shape="circle" icon={<SendOutlined />} onClick={handleSendText} />
                            <Button shape="circle" icon={isRecording ? <StopOutlined onClick={handleStopRecording} /> : <AudioOutlined onClick={handleStartRecording} />} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHelper;