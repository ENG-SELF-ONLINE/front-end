// eslint-disable-next-line no-unused-vars
import React from 'react';
import image from './images/image.png';
import './styles.css'
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Article = ({activeLevel, topicId}) => {

    const navigate = useNavigate(); // Инициализация navigate
    const articleData = [{
        "id": 1,
        "title": "Introduction to English",
        "content": [
            {"type": "paragraph", "text": "Собирательные существительные в английском языке (collective nouns, group nouns) — это существительные, которые обозначают группу или коллектив объектов, людей или животных. Они используются для обозначения множества отдельных элементов как единого целого."},
            {"type": "image", "url": image, "alt": "Иллюстрация"},
            {
                "type": "paragraph",
                "text": "Собирательные существительные могут использоваться как единственное число, если они обозначают одну группу, или во множественном числе, если они обозначают несколько групп. Например:\n" +
                    "\n" +
                    "- \"The team is playing well.\" (Команда играет хорошо.)\n" +
                    "- \"The teams are playing well.\" (Команды играют хорошо.)\n" +
                    "\n" +
                    "Собирательные существительные могут также использоваться с определенными или неопределенными артиклями, в зависимости от контекста. Например:\n" +
                    "\n" +
                    "- \"A family of ducks swam across the pond.\" (Семья уток переплыла через пруд.)\n" +
                    "- \"The family of ducks swam across the pond.\" (Семья уток переплыла через пруд.)\n" +
                    "\n" +
                    "Важно помнить, что глаголы и местоимения, которые используются с собирательными существительными, могут меняться в зависимости от контекста и специфики группы или коллективного существа. Поэтому при использовании собирательных существительных важно обращать внимание на контекст и согласовывать глаголы и местоимения с их числом.\n" +
                    "\n" +
                    "В целом, собирательные существительные используются для обозначения коллективной группы объектов, людей или животных и играют важную роль в английской грамматике."
            },
            {"type": "list", "items": ["I eat breakfast.", "She goes to work."]}
        ],
        "sources": [
            {"type": "website", "url": "https://www.englishclub.com/", "name": "EnglishClub"},
            {"type": "website", "url": "https://www.bbc.co.uk/learningenglish", "name": "BBC Learning English"}
        ],
        "youtubeLinks": [
            "https://www.youtube.com/watch?v=video1",
            "https://www.youtube.com/watch?v=video2"
        ]
    }];

    const handleStartTest = () => {
        console.log('clicked');
        navigate(`/grammar/${activeLevel}/${topicId}/test`); // Используйте navigate для перехода на страницу
    };

    const renderContent = (article) => {
        if (!article || !article.content) return <div>Статья не содержит контента.</div>;

        return (
            <>
                {article.content.map((item, index) => {
                    switch (item.type) {
                        case 'paragraph':
                            return <p key={index}>{item.text}</p>;
                        case 'image':
                            return (
                                <img
                                    key={index}
                                    src={item.url}
                                    alt={item.alt || `Изображение ${index + 1}`}
                                    className="article-image"
                                />
                            );
                        case 'list':
                            return (
                                <ul key={index}>
                                    {item.items.map((listItem, listItemIndex) => (
                                        <li key={listItemIndex}>{listItem}</li>
                                    ))}
                                </ul>
                            );
                        default:
                            return <div key={index}>Неизвестный тип элемента: {item.type}</div>;
                    }
                })}
                {article.sources && (
                    <div className="sources">
                        <h3>Источники:</h3>
                        <ul>
                            {article.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                                        {source.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {article.youtubeLinks && (
                    <div className="youtube-links">
                        <h3>Полезные видео на YouTube:</h3>
                        <ul>
                            {article.youtubeLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                        Видео {index + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    };


    return (
        <div className="article-container">
            {articleData.map((article) => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    {renderContent(article)}
                    <div className="test-button-container"> {/* Контейнер для кнопки */}
                        <Button type="primary" size="large" style={{margin: '20px auto'}} onClick={handleStartTest}>
                            Пройти тест
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Article;