import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Styles/DashboardCss.css"
function Dashboard({newsItems ,setNewsItems}) {
    // const [newsItems, setNewsItems] = useState([]);

    

    const deleteNewsItem = async (id) => {
        console.log(id);
        try {
            // Delete the news item from the backend
            await axios.delete(`http://localhost:5000/api/news/delete/${id}`);
            // Refresh the news items after deletion
            const updatedNewsItems = await axios.get('http://localhost:5000/api/news');
            setNewsItems(updatedNewsItems.data);
        } catch (error) {
            console.error('Error deleting news item:', error);
        }
    };

    const handleUpvote = async (id) => {
        try {
            // Check if the user has already upvoted
            const response = await axios.get(`http://localhost:5000/api/news/${id}`);
            const hasUpvoted = response.data.hasUpvoted;
      
            // If the user hasn't upvoted, update the upvote count on the backend
            if (!hasUpvoted) {
              await axios.put(`http://localhost:5000/api/news/upvote/${id}`);
              // Refresh the news items after upvoting
              const updatedNewsItems = await axios.get('http://localhost:5000/api/news');
              setNewsItems(updatedNewsItems.data);
            }
          } catch (error) {
            console.error('Error handling upvote:', error);
        }
    };

    const markAsRead = async (news) => {
        try {
            await axios.put(`/api/news/mark-as-read/${news._id}`);
            refreshNews(); // Fetch updated news list
        } catch (error) {
            console.error('Error marking news item as read:', error);
        }
    };
    const refreshNews = async () => {
        try {
            const response = await axios.get('/api/news');
            setNewsItems(response.data);
        } catch (error) {
            console.error('Error fetching news items:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="header">HackerNews Clone</h1>
            {/* Form to add a new news item */}
            <form className="form">
                {/* ... (unchanged) */}
            </form>

            {/* Display the existing news items */}
            <ul className="news-list">
                {newsItems.map(item => (
                    <li key={item._id} className="news-item">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.url}
                        </a>
                        <p>Posted On: {new Date(item.postedOn).toLocaleString()}</p>
                        <p>Upvotes: {item.upvotes}</p>
                        <p>Comments: {item.comments}</p>
                        <p>User Id : {item._id}</p>

                        {/* Upvote button */}
                        <button className="upvote-button" onClick={() => handleUpvote(item._id)}>
                            Upvote
                        </button>
                        
                        {/* Delete button */}
                        <button className="delete-button" onClick={() => deleteNewsItem(item._id)}>
                            Delete
                        </button>
                        {/*Mark as Read Button */}
                        <button onClick={() => markAsRead(item)}>Mark as Read</button>
                    </li>
                ))}
            </ul>
    </div>
    );
}

export default Dashboard;
