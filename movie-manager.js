var fetch = require('node-fetch');
var CloudKit = require('./cloudkit.js');
var containerConfig = require('./cloudkit-config.js');
// ====================================================
 
// CONFIGURANDO CLOUDKIT
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
CloudKit.configure({
    services: {
        fetch: fetch
        , logger: console
    }
    , containers: [containerConfig]
}); 
var container = CloudKit.getDefaultContainer();
var publicDB = container.publicCloudDatabase; 
// Autenticacao s2s do CloudKit
container.setUpAuth().then(function (userInfo) {
    console.log("Servidor Node Autenticado no CloudKit. UserInfor --> " + userInfo);
}).catch(function (error) {
    console.log(error);
    res.json(error);
});

// ====================================================
  
// Método publicos do modulo CloudKit
module.exports = { 
    // *listAllMovies* eh uma funcao publica que busca todos os filmes
    listAllMovies: function (callback) {
        publicDB.performQuery({
            recordType: 'Movie'
        }).then(function (response) {
            var records = response.records;
            var movies = [];

            records.forEach(function (record) {
                movies.push({
                    'title': record.fields['title'].value
                    , 'description': record.fields['description'].value
                    , 'id': record.fields['id'].value,

                });
            });
            callback(movies);
        }).catch(function (error) {
            console.log(error);
            callback(error);
        });
    }
    ,  
    // *movieByID* eh uma funcao publica que busca um filme pelo seu ID
    movieByID: function (id, callback) {
        console.log(id);
        console.log(callback);

        var query = {
            recordType: 'Movie'
            , filterBy: [{
                systemFieldName: 'recordName'
                , comparator: 'EQUALS'
                , fieldValue: {
                    value: {
                        recordName: id
                    }
                }
            }]
        };
        publicDB.performQuery(query).then(function (response) {
            var records = response.records;
            if (records.length === 0) {
                callback({});
                return;
            }
            var movie = {
                'title': records[0].fields['title'].value
                , 'description': records[0].fields['description'].value
                , 'id': records[0].recordName
            };
            callback(movie);
        }).catch(function (error) {
            console.log(error);
            callback(error);
        });
    }
    ,  
    // *movieByTitleToken* eh uma funcao publica que busca um filme cujo nome coincida com o token passado
    movieByTitleToken: function (titleToken, callback) {
        var query = {
            recordType: 'Movie'
            , filterBy: [{
                fieldName: 'title'
                , comparator: 'CONTAINS_ANY_TOKENS'
                , fieldValue: {
                    value: titleToken
                }
            }]
        }; 
        publicDB.performQuery(query).then(function (response) {
            var records = response.records;
            var movies = []; 
            records.forEach(function (record) {
                movies.push({
                    'title': record.fields['title'].value
                    , 'description': record.fields['description'].value
                    , 'id': record.recordName
                });
            });
            callback(movies);
        }).catch(function (error) {
            console.log(error);
            callback(error);
        });
    }
    , insertMovie: function (movie, callback) {
        var record = {
            recordType: 'Movie'
            , fields: {
                'title': {
                    value: movie.title
                }
                , 'description': {
                    value: movie.description
                }
            , }
        }; 
        var options = {
            zoneName: undefined
            , operationType: 'forceUpdate'
        }; 
        publicDB.saveRecord(record, options).then(function (response) {
            var createdRecord = response.records[0];
            var movie = {
                'title': createdRecord.fields['title']
                , 'description': createdRecord.fields['description']
                , 'id': createdRecord.recordName
            };
            callback(movie);
        }).catch(function (error) {
            console.log(error);
            callback(error);
        });
    }, // *updateMovie* eh uma funcao publica que atualiza um filme que ja esta no bd, para isso eh necessario informar o ID do filme
    updateMovie: function (movie, callback) {
        var query = {
            recordType: 'Movie'
            , filterBy: [{
                systemFieldName: 'recordName'
                , comparator: 'EQUALS'
                , fieldValue: {
                    value: {
                        recordName: movie.id
                    }
                }
            }]
        };
        publicDB.performQuery(query).then(function (response) { 
            var records = response.records;
            if (records.length == 0) {
                res.json({
                    "error": "Não foi possível encontra o registro [" + id + "]"
                });
                return;
            }
            if (movie.title) {
                records[0].fields['title'].value = movie.title;
            }
            if (movie.description) {
                records[0].fields['description'].value = movie.description;
            } 
            var options = {
                zoneName: undefined
                , operationType: 'forceUpdate'
            };
            console.log("Salvando registro que foi alterado")
            publicDB.saveRecord(records[0], options).then(function (response) {
                var savedRecord = response.records[0];
                var movie = {
                    'title': savedRecord.fields['title']
                    , 'description': savedRecord.fields['description']
                    , 'id': savedRecord.recordName
                };
                callback(movie);
            }).catch(function (error) {
                console.log(error);
                callback(error);
            });
        }).catch(function (error) {
            console.log(error);
            callback(error);
        });
    }


    // *removeMovie* eh uma funcao publica que remove um filme pelo seu ID


    /* removeMovie: function (id, callback) {
         // Dados inserido hardcoded, posteriormente será
         // substituído pelo banco de dados do CloudKit
          
         switch (id) {
         case deadpoolMovie.id:
             callback(deadpoolMovie);
             break;
         case starwarsMovie.id:
             callback(starwarsMovie);
             break;
         case hotelMovie.id:
             callback(hotelMovie);
             break;
         default:
             callback({
                 error: "Não foi possível remover, id [" + id + "] não encontrado"
             });
         }
     }*/
}