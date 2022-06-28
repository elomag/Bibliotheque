const express = require('express')
const app = express();
const port = 8080;

const mongoose = require('mongoose');
const Livres = require('./livres/livres')


mongoose.connect(
    'mongodb+srv://Elo:1234@cluster0.bg2bzb7.mongodb.net/biblio2?retryWrites=true&w=majority'
    , err => {
        if (err) throw 'erreur est : ', err;
        console.log('connected to MongoDB')
    });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log('le serveur 8080 fonctionne bien!!!');
})


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});







// méthode de recherche par MOT CLE    

app.get('/byKeyWord', async (req, res)=>{               // /byKeyWord = défintion du nom de la route pour accéder à la recherche définie après
    const param = req.query.Key                         // const param = arbitraire; "Key" = const qu'on récupèrera par la requête grace au query (dans Postman)
                                                        // const searchByKeyWord = constante arbitraire pour stocker le résultat de la recherche
    const searchByKeyWord = await Livres.find({         // fonction de recherche (toute prête) find by (par critère)
        $or: [                                          // $or = indique un tableau de catégories dans lesquelles chercher
            { 'titre': new RegExp(param, 'i') },        // RegExp() = fonction (toute prête) pour rechercher une chaîne de cractères sans respect de la casse
            { 'auteur': new RegExp(param, 'i') },
            { 'genre': new RegExp(param, 'i') }
          ]
    })
    res.json(searchByKeyWord)                           // exprimer le résultat en json
})


// méthode GET by Edition
// app.get('/byEdition', async (req, res) => {
//     let min = req.query.min;
//     let max = req.query.max;
//           const livresByEdition = await Livres.find({ edition: { $gte : min , $lte : max } });
//           res.json(livresByEdition);
//   });


// méthode GET by PRIX
app.get('/byPrix', async (req, res) => {              // déclaration du chemin qui portera cette méthode
    let min = req.query.min;                           // déclaration de la valeur minimale
    let max = req.query.max;                           // déclaration de la valeur maximale
    const livresByPrix = await Livres.find({
        prix: { $gte: min, $lte: max }
    })                                                // gte pour "greater than or equal" (+gd que) / lte pour "less than or equal" (+pt que)
    res.json(livresByPrix)
    // console.log(livresByPrix);
})


// méthode GET by Catégorie ou par Genre
app.get('/byGenre', async (req, res) => {           // la syntaxe '/...' désigne un query (une requête) // on crée un chemin qu'on lui indique
    const genreBodyReq = req.query.genre            // const genreBodyReq = une constante que je définis et récupère dans ma requête grâce au query
    const livresByGenre = await Livres.find({       // je fais une recherche find by (+ critère) dans mon objet Livres
        genre: genreBodyReq
    })
    res.json(livresByGenre)                         // j'envoie la réponse qui figure dans Postman en réponse à cette recherche: http://localhost:8080/byGenre?genre=Roman
})                                                  // !!! Attention : SENSIBLE à la casse !!!


// méthode POST
app.post('/', async (req, res) => {
    const img = req.body.img
    const titre = req.body.titre
    const auteur = req.body.auteur
    const edition = req.body.edition
    const genre = req.body.genre
    const prix = req.body.prix

    const nouveau_livre = new Livres({
        img: img,
        titre: titre,
        auteur: auteur,
        edition: edition,
        genre: genre,
        prix: prix
    })
    await nouveau_livre.save()
    res.json(nouveau_livre)
    return
})


app.get('/', async (req, res) => {
    const livres = await Livres.find()                  // On récupère TOUS les livres
    res.json(livres)
})


app.get('/:id', async (req, res) => {                   // la syntaxe, après le slash, désigne un paramètre
    const id = req.params.id
    const livre = await Livres.findOne({ _id: id })     // on récupère 1 SEUL livre
    res.json(livre)
})


app.delete('/:id', async (req, res) => {
    const id = req.params.id
    const suppr = await Livres.deleteOne({ _id: id })   // on supprime 1 SEUL livre
    res.json(suppr)
})


app.patch('/:id', async (req, res) => {                 // on enregistre QUE les changements
    const id = req.params.id
    const livre = await Livres.findOne({ _id: id })

    const img = req.body.img;
    const titre = req.body.titre;
    const auteur = req.body.auteur;
    const edition = req.body.edition;
    const genre = req.body.genre;
    const prix = req.body.prix

    if (img) { livre.img = img }
    if (titre) { livre.titre = titre }
    if (auteur) { livre.auteur = auteur }
    if (edition) { livre.edition = edition }
    if (genre) { livre.genre = genre }
    if (prix) { livre.prix = prix }

    await livre.save()
    res.json(livre)
})


