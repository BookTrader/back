const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Anuncio = require('../app/model/Anuncio');
const Exemplar = require('../app/model/Exemplar');
const Imagem = require('../app/model/Imagem');
const Usuario = require('../app/model/Usuario');
const Proposta = require('../app/model/Proposta');
const Troca = require('../app/model/Troca');

const connection = new Sequelize(dbConfig);

Usuario.init(connection);
Exemplar.init(connection);
Imagem.init(connection);
Anuncio.init(connection);
Proposta.init(connection);
Troca.init(connection);

Usuario.associate(connection.models);
Exemplar.associate(connection.models);
Imagem.associate(connection.models);
Anuncio.associate(connection.models);
Proposta.associate(connection.models);
Troca.associate(connection.models);

module.exports = connection;