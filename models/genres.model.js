// Inside models/genres.model.js
const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
}, { timestamps: false});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;




