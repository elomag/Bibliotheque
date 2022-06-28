const mongoose = require('mongoose');

const schema = mongoose.Schema({
    titre: String,
    auteur: String,
    genre: String,
    edition: Number
})

module.exports = mongoose.model('livre', schema)