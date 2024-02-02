import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import "../Styles/AddNewsCss.css"

function AddNews() {
    const [newsItems, setNewsItems] = useState([]);
    const [formData, setFormData] = useState({
        url: '',
        hackerNewsUrl: '',
        upvotes: 0,
        comments: 0,
    });

    useEffect(() => {
        // Fetch news items from the backend
        axios.get('http://localhost:5000/api/news')
            .then(response => setNewsItems(response.data))
            .catch(error => console.error('Error fetching news items:', error));
    }, []);

    const addNewsItem = async () => {
        try {
            // Add the new news item to the backend
            await axios.post('http://localhost:5000/api/news/add', formData);
            // Refresh the news items after adding
            const updatedNewsItems = await axios.get('http://localhost:5000/api/news');
            setNewsItems(updatedNewsItems.data);
            // Reset the form fields
            setFormData({
                url: '',
                hackerNewsUrl: '',
                upvotes: 0,
                comments: 0,
            });
        } catch (error) {
            console.error('Error adding news item:', error);
        }
    };

    const handleChange = (e) => {
        // Update the form data when input fields change
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    

    return (
        <div className="form-container">
            <h1>HackerNews Clone</h1>
            {/* Form to add a new news item */}
            <form>
                <label className="form-label">
                    URL:
                    <input className="form-input" type="text" name="url" value={formData.url} onChange={handleChange} />
                </label>
                <br />
                <label className="form-label">
                    Hacker News URL:
                    <input className="form-input" type="text" name="hackerNewsUrl" value={formData.hackerNewsUrl} onChange={handleChange} />
                </label>
                <br />
                <label className="form-label">
                    Upvotes:
                    <input className="form-input" type="number" name="upvotes" value={formData.upvotes} onChange={handleChange} />
                </label>
                <br />
                <label className="form-label">
                    Comments:
                    <input className="form-input" type="number" name="comments" value={formData.comments} onChange={handleChange} />
                </label>
                <br />
                <button className="form-button" type="button" onClick={addNewsItem}>
                    Add News Item
                </button>
            </form>

            {/* Display the existing news items */}
            
            <Dashboard newsItems={newsItems} setNewsItems={setNewsItems} />
        </div>
    );
}

export default AddNews;
