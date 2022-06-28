const mongoose = require('mongoose');

const schema = mongoose.Schema({
    img: String,
    titre: String,
    auteur: String,
    edition: Number,
    genre: String,
    prix: Number
})

module.exports = mongoose.model('livre', schema)