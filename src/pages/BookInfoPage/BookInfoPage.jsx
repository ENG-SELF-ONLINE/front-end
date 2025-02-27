// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import './styles.css';
import {Button, message} from "antd";
import Sidebar from "../../components/MainMenu/Sidebar.jsx";
import UpperMenu from "../../components/UpperMenu/UpperMenu.jsx";
import {HeartFilled, HeartOutlined} from '@ant-design/icons';
import download from './images/download.png';
import {useParams} from "react-router-dom";
import axiosInstance from "../../setupAxiosInterceptors.jsx";

const BookInfoPage = () => {
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const {bookId} = useParams();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8082/books/${bookId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }); // Adjust the URL based on your API
                setBookData(response.data);

                const favoritesResponse = await axiosInstance.get(`http://localhost:8082/favourites`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const isBookInFavorites = favoritesResponse.data.content.some(
                    (favorite) => favorite.book.bookId === bookId
                );
                setIsFavorite(isBookInFavorites);

            } catch (error) {
                console.error('Error fetching book data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8082/books/${bookId}/download`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', bookData.bookFile);
            document.body.appendChild(link);
            link.click();
            message.success('Download started');
        } catch (error) {
            console.error('Error downloading book:', error);
            message.error('Download failed');
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                // Remove from favorites
                await axiosInstance.delete(`http://localhost:8082/favourites/books/${bookId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                message.success('Removed from favorites');
            } else {
                // Add to favorites
                await axiosInstance.post(`http://localhost:8082/favourites/books/${bookId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                message.success('Added to favorites');
            }
            setIsFavorite(!isFavorite); // Toggle favorite state
        } catch (error) {
            console.error('Error toggling favorite:', error);
            message.error('Failed to update favorites');
        }
    };

    const handleCompleted = async () => {

        try {
            await axiosInstance.post(`http://localhost:8082/book-progress/${bookId}/mark-completed`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            message.success('Book marked as completed');
        } catch (error) {
            console.error('Error marking book as completed:', error);
            message.error('Failed to mark book as completed');
        }
    };

    const handleCancel = async () => {

        try {
            await axiosInstance.post(`http://localhost:8082/book-progress/${bookId}/unmark-completed`, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            message.success('Book marked as not completed');
        } catch (error) {
            console.error('Error unmarking book:', error);
            message.error('Failed to unmark book as completed');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    const getCoverImageUrl = (coverImage) => {
        return `http://localhost:9999/files/images/show?bucket=COVERS&file=${coverImage}`;
    };

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
                            <img src={bookData.coverImage ? getCoverImageUrl(bookData.coverImage) : null}
                                 alt="Book Cover" className="image-container-with-text"/>
                            <div className="numeric-info-container">
                                <div className="flex-row-container">
                                    <img src={download} className="image-with-text-overlay2" alt="Downloads"/>
                                    <p className="number-text-divider">{bookData.downloads}</p>
                                </div>
                                <div className="flex-row-container">
                                    <HeartOutlined className="image-with-text-overlay1" alt="Likes"/>
                                    <p className="number-text-divider">{bookData.likes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="story-card-container">
                            <div className="story-container3">
                                <div className="fantasy-card-with-title">
                                    <p className="epic-title-text-style">{bookData.title}</p>
                                    <div className="fantasy-container" onClick={toggleFavorite}>
                                        {isFavorite ? (
                                            <HeartFilled className="fantasy-image-style" style={{color: 'red'}}
                                                         alt="Remove from Favorites"/>
                                        ) : (
                                            <HeartOutlined className="fantasy-image-style" alt="Add to Favorites"/>
                                        )}
                                    </div>
                                    <p className="fantasy-title">{bookData.genre}</p>
                                </div>
                                <p className="author-name-text-style">{bookData.author}</p>
                            </div>
                            <p className="narrative-text-style">{bookData.description}</p>
                        </div>
                    </div>
                    <p className="book-summary-text-style">
                        <span className="strong-emphasis-text-style">Hard words:</span>
                        <span>{" "}{bookData.hardWords}</span>
                    </p>
                    <div className="download-section2">
                        <div className="flex-row-container">
                            <Button className="download-button-style" onClick={handleDownload}>Download</Button>
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