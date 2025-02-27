// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import './styles.css'
import {Button} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const Article = () => {
    const navigate = useNavigate();
    const {topicId} = useParams();
    const {level} = useParams();
    const [article, setArticle] = useState(null);
    const [lessonMaterialId, setLessonMaterialId] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8083/lesson-materials/lessons/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setLessonMaterialId(response.data.lessonMaterialsId);
                console.log(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchArticleData();
    }, [topicId, accessToken]);

    useEffect(() => {
        const fetchLessonMaterialAndDetails = async () => {
            if (!lessonMaterialId) return;

            try {
                const materialResponse = await axiosInstance.get(
                    `http://localhost:8083/lesson-materials/${lessonMaterialId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const detailsResponse = await axiosInstance.get(
                    `http://localhost:8083/lesson-materials/${lessonMaterialId}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const combinedData = {
                    ...materialResponse.data,
                    materials: detailsResponse.data.materials,
                };

                setArticle(combinedData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchLessonMaterialAndDetails();
    }, [lessonMaterialId, accessToken]);

    const handleStartTest = () => {
        navigate(`/grammar/${level}/${topicId}/test`);
    };

    const renderContent = (content) => {
        return content.map((item, index) => {
            switch (item.type) {
                case 'paragraph':
                    return <p key={index}>{item.text}</p>;
                case 'image':
                    return (
                        <img
                            key={index}
                            src={item.url}
                            alt={`Изображение ${index + 1}`}
                            className="article-image"
                        />
                    );
                case 'list':
                    return (
                        <ul key={index}>
                            {Array.isArray(item.items) ? (
                                item.items.map((listItem, listItemIndex) => (
                                    <li key={listItemIndex}>{listItem}</li>
                                ))
                            ) : (
                                <li>No items found</li>
                            )}
                        </ul>
                    );
                default:
                    return <div key={index}>Неизвестный тип элемента: {item.type}</div>;
            }
        });
    };

    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="article-container">
            {article && (
                <div>
                    <h2>{article.lesson.title}</h2>
                    {renderContent(article.materials.content)}
                    <div className="test-button-container">
                        <Button type="primary" size="large" style={{margin: '20px auto'}} onClick={handleStartTest}>
                            Пройти тест
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Article;