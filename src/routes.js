const express = require('express');
const UsuarioController = require('./controllers/UsuarioController');


const routes = express.Router();

routes.get('/usuario', UsuarioController.list);
routes.post('/usuario', UsuarioController.store);

module.exports = routes;