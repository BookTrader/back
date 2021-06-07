const express = require('express');
const UsuarioController = require('./controllers/UsuarioController');
const AuthController = require('./controllers/AuthController')


const routes = express.Router();

//Auth
routes.post('/login', AuthController.login);

// Usuario
routes.get('/usuario', UsuarioController.list);
routes.post('/usuario', UsuarioController.store);

module.exports = routes;