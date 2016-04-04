var express = require('express');
var bodyParser = require('body-parser');
var movieManager = require('./movie-manager.js');
var app = express();

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Resposta a raiz do projeto
app.get('/', function (req, res) {
    res.send('Servidor funcionando ...');
});

//lista Todos os Filmes
app.get('/movies', function (req, res) {
    movieManager.listAllMovies(function (movies) {
        res.json(movies);
    });
});

// busca um filme baseado no seu ID
app.get('/movies/:id', function (req, res) { 
    var id = req.params.id; 
    movieManager.movieByID(id, function (movie) {
        res.json(movie);
    }); 
});   
// busca os filmes por parte do título
app.get('/movies/title/:title', function (req, res) { 
    var title = req.params.title; 
    movieManager.movieByTitleToken(title, function (movies) {
        res.json(movies);
    }); 
});   
// insere um novo filme na base de dados
app.post('/movies', function (req, res) { 
    var movie = {
        title: req.body['title']
        , description: req.body['description']
    } 
    movieManager.insertMovie(movie, function (movieSaved) {
        res.json(movieSaved);
    }); 
});   
// atualiza um filme na base de dados baseado em seu ID
app.put('/movies', function (req, res) { 
    var movie = {
        title: req.body['title']
        , description: req.body['description']
        , id: req.body['id']
    } 
    movieManager.updateMovie(movie, function (movieSaved) {
        res.json(movieSaved);
    }); 
});   
// remove um registro do banco de dados baseado no id
app.delete('/movies/:id', function (req, res) { 
    var id = req.params.id; 
    movieManager.removeMovie(id, function (movieRemoved) {
        res.json(movieRemoved);
    }); 
});  
app.listen(process.env.PORT || 8080);