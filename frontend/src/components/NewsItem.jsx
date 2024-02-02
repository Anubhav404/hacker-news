// NewsItem.js
import React from 'react';
import axios from 'axios';

const NewsItem = ({ news, refreshNews }) => {
    const markAsRead = async () => {
        try {
            await axios.put(`/api/news/mark-as-read/${news._id}`);
            refreshNews(); // Fetch updated news list
        } catch (error) {
            console.error('Error marking news item as read:', error);
        }
    };

    const deleteNewsItem = async () => {
        try {
            await axios.put(`/api/news/delete/${news._id}`);
            refreshNews(); // Fetch updated news list
        } catch (error) {
            console.error('Error marking news item as deleted:', error);
        }
    };

    return (
        <div className="news-item">
            {/* Display news item details */}
            <p>{news.url}</p>
            {/* Other details... */}

            {/* Buttons for actions */}
            <button onClick={markAsRead}>Mark as Read</button>
            <button onClick={deleteNewsItem}>Delete</button>
        </div>
    );
};

export default NewsItem;
