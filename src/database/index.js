const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Anuncio = require('../model/Anuncio');
const Exemplar = require('../model/Exemplar');
const Imagem = require('../model/Imagem');
const Usuario = require('../model/Usuario');

const connection = new Sequelize(dbConfig);

Usuario.init(connection);
Exemplar.init(connection);
Imagem.init(connection);
Anuncio.init(connection);

Usuario.associate(connection.models);
Exemplar.associate(connection.models);
Imagem.associate(connection.models);
Anuncio.associate(connection.models);

module.exports = connection;