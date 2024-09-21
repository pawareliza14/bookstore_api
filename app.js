require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Genre = require('./models/genres.model.js');
const Book = require('./models/books.model.js')

const app = express();
const PORT = 3000;
const DB_NAME = 'bookstore_api'; // Define your database name here

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(`${MONGO_URI}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Error handling for MongoDB connection
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.get('/', (req, res) => {
  res.send("Please use /api/books or /api/genres");
});

app.get('/api/genres', async (req, res) => {
  try {
    const genres = await Genre.find().exec(); // Ensure `Genre` is a Mongoose model.
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving genres', error: error.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    let books = await Book.find().exec(); // Ensure `Genre` is a Mongoose model.
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
});

app.get('/api/books/:_id',async(req,res) =>
{
  try{
    const books = await Book.findById(req.params._id).exec();
    if (!books) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(books);
  } catch(error){
    res.status(500).json({message: 'Error retrieving books',error:error.message });
  }
});

app.put('/api/genres/:_id',async(req,res) => {
  
    const id = req.params._id;
    const genre = req.body;
  
    try {
        const updatedGenre = await Genre.findByIdAndUpdate(id, genre, { new: true });
        if (!updatedGenre) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.json(updatedGenre);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.put('/api/books/:_id',async(req,res) => {
  
    const id = req.params._id;
    const book = req.body;
  
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
        if (!updatedBook ) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.delete('/api/genres/:_id',async(req,res) => {
  try{
    const genre = await Genre.findByIdAndDelete(req.params._id);
    if(!genre) return res.status(404).json({message: 'Genre not found'});
    res.json({message:'Task deleted',genre});
  }catch (error){
    res.status(400).json({error:error.message});
  }
})


app.post('/api/genres', async (req, res) => {
  try {
    const { name } = req.body;

    // Validate the input
    if (!name) {
      return res.status(400).json({ message: 'Genre name is required' });
    }

    // Create a new genre
    const newGenre = new Genre({ name });
    await newGenre.save();

    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ message: 'Error creating genre', error: error.message });
  }
});



// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
});
