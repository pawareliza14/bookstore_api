const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String,
        index: true,
        unique: true

        

    },
    author:{
        required: true,
        type: String,
        

    },
    genre:{
        required: true,
        type: String,
        

    },
    image:{
        required: true,
        type: String,
        

    },
    description:{
        type: String,
    }
});

const Book = mongoose.model('Book',bookSchema);

module.exports = Book;
