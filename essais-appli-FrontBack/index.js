const express = require('express')
const mongoose = require('mongoose')
const Livres = require('./livres')
const app = express();
const port = 8080;

app.listen(port, () => {
    console.log('le serveur 8080 fonctionne bien!!!');
})

mongoose.connect(
    'mongodb+srv://Elo:1234@cluster0.bg2bzb7.mongodb.net/biblio2?retryWrites=true&w=majority'
    , err => {
        if (err) throw 'erreur est : ', err;
        console.log('connected to MongoDB')
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ******************POST***********************************************
app.post('/', async (req, res) => {
    const titre = req.body.titre
    const auteur = req.body.auteur
    const genre = req.body.genre
    const edition = req.body.edition
    
    const nouveau_livre = new Livres({
        titre: titre,
        auteur: auteur,
        genre: genre,
        edition : edition,
    })
    await nouveau_livre.save()
    res.json(nouveau_livre)
    return
})
// ******************GET************************************************
app.get('/', async (req, res) => {
    const livres = await Livres.find() // On récupère tous les livres
    res.json(livres)
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    const livre = await Livres.findOne({ _id: id })
    res.json(livre)
})
// *****************DELETE************************************************
app.delete('/:id', async (req, res) => {
    const id = req.params.id
    const suppr = await Livres.deleteOne({ _id: id })
    res.json(suppr)
})
// ****************PATCH**************************************************
app.patch('/:id', async (req, res) => {
    const id = req.params.id
    const livre = await Livres.findOne({ _id: id })

    const titre = req.body.titre;
    const auteur = req.body.auteur;
    const genre = req.body.genre;
    const edition = req.body.edition;

    if (titre) { livre.titre = titre }
    if (auteur) { livre.auteur = auteur }
    if (genre) { livre.genre = genre }
    if (edition) { livre.edition = edition }

    await livre.save()
    res.json(livre)
})