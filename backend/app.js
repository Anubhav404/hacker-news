 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const encodedPassword = encodeURIComponent('Your_password_here');
const URI = `mongodb+srv://anubhavsoni46:${encodedPassword}@cluster0.9vdamvf.mongodb.net/News`;

mongoose.connect(URI);

//user schema 
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  
const User = mongoose.model('User', userSchema);


const newsSchema = new mongoose.Schema({
    url: String,
    hackerNewsUrl: String,
    postedOn: Date,
    upvotes: Number,
    comments: Number,
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isRead: { type: Boolean, default: false }, // New field for marking as read
});

const News = mongoose.model('News', newsSchema);



// Mark as read
app.put('/api/news/mark-as-read/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await News.findByIdAndUpdate(id, { isRead: true });
        res.json({ message: 'Marked as read successfully' });
    } catch (error) {
        console.error('Error marking news item as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Delete news item (soft delete)
// app.put('/api/news/delete/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await News.findByIdAndUpdate(id, { isRead: true });
//         res.json({ message: 'Marked as deleted successfully' });
//     } catch (error) {
//         console.error('Error marking news item as deleted:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });







// signup and login functionalities

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, 'secret-key', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Protected route example
  app.get('/api/protected', (req, res) => {
    res.json({ message: 'This is a protected route!' });
  });

















// Function to add a new news item to the database
const addNewsItem = async (newsData) => {
  try {
      const newNewsItem = new News(newsData);
      await newNewsItem.save();
      console.log('News item added to the database');
  } catch (error) {
      console.error('Error adding news item to the database:', error);
  }
};

// Function to get all news items from the database
const getAllNewsItems = async () => {
  try {
      const newsItems = await News.find().sort({ postedOn: -1 });
      return newsItems;
  } catch (error) {
      console.error('Error fetching news items from the database:', error);
      throw error;
  }
};

// ...

app.get('/api/', async (req, res) => {
  try {
      const newsItems = await getAllNewsItems();
      res.json(newsItems);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to handle upvoting a news item
// app.put('/api/news/upvote/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       // Assuming you have a News model with an 'upvotes' field
//       await News.findByIdAndUpdate(id, { $inc: { upvotes: 1 } });
//       res.json({ message: 'Upvoted successfully' });
//     } catch (error) {
//       console.error('Error upvoting news item:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


app.put('/api/news/upvote/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const newsItem = await News.findById(id);

      if (!newsItem.upvoters.includes(userId)) {
        await News.findByIdAndUpdate(id, {
          $inc: { upvotes: 1 },
          $push: { upvoters: userId },
        });
        res.json({ message: 'Upvoted successfully' });
      } else {
        await News.findByIdAndUpdate(id, {
          $inc: { upvotes: -1 },
          $pull: { upvoters: userId },
        });
        res.json({ message: 'Upvote undone' });
      }
    } catch (error) {
      console.error('Error upvoting news item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const newsItem = await News.findById(id);
      console.log(newsItem);

  
      // Retrieve the user ID from your authentication system
    //   const userId = req.user.id; // Replace with the actual method to get user ID
        const userId = newsItem._id;
  
      // Check if the user has upvoted by comparing their user ID
      const hasUpvoted = newsItem.upvoters.includes(userId);

      res.json({ hasUpvoted });
    } catch (error) {
      console.error('Error getting news item information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});



// add the news functionality
app.post('/api/news/add', async (req, res) => {
  try {
      const { url, hackerNewsUrl, upvotes, comments } = req.body;
      const postedOn = new Date();
      await addNewsItem({ url, hackerNewsUrl, postedOn, upvotes, comments });
      res.json({ message: 'News item added successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to delete a news item
app.delete('/api/news/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        await News.findByIdAndDelete(id);
        res.json({ message: 'News item deleted successfully' });
    } catch (error) {
        console.error('Error deleting news item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.get('/api/news', async (req, res) => {
    try {
        const newsItems = await News.find().sort({ postedOn: -1 });
        res.json(newsItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add other endpoints like marking as read, updating upvotes, etc.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
