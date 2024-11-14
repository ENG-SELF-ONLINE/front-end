// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button } from "antd";
import "./styles.css";
import move from "./images/move.png";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx"; // Или как вы импортируете

const Translator = () => {
    const [textToTranslate, setTextToTranslate] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isEnglishLeft, setIsEnglishLeft] = useState(true); // Состояние для слева/справа

    const handleTranslate = () => {
        const translation = `${textToTranslate}`; // Заглушка: заменяйте на реальный перевод
        setTranslatedText(translation);
        console.log("Translation:", translation);
    };

    const handleLanguageSwitch = () => {
        setIsEnglishLeft(!isEnglishLeft);
    };

    return (
        <div className="translator-page">
            <Sidebar />
            <div className="translator-main">
                <div className="translator-upper-content">
                    <UpperMenu />
                </div>
                <p className="translator-title">Переводчик</p>
                <div className="translation-container">
                    <div className="input-containers">
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Английский" : "Русский"}
                            </p>
                            <textarea
                                value={isEnglishLeft ? textToTranslate : translatedText}
                                onChange={
                                    isEnglishLeft
                                        ? (e) => setTextToTranslate(e.target.value)
                                        : (e) => setTranslatedText(e.target.value)
                                }
                                className="translation-input"
                                wrap="soft" // Ключевой атрибут!
                            />
                        </div>
                        <div
                            className="text-image-container"
                            onClick={handleLanguageSwitch}
                        >
                            <img src={move} alt="" />
                        </div>
                        <div className="input-container">
                            <p className="language-heading-style">
                                {isEnglishLeft ? "Русский" : "Английский"}
                            </p>
                            <textarea
                                value={isEnglishLeft ? translatedText : textToTranslate}
                                readOnly
                                className="translation-output"
                                wrap="soft"
                            />
                        </div>
                    </div>
                </div>
                <div className="translate-button-container">
                    <Button className="translate-button-style" onClick={handleTranslate}>
                        Перевести
                    </Button>
                    <Button className="move-button-style">В словарь</Button>
                </div>
            </div>
        </div>
    );
};

export default Translator;