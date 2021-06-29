const express = require('express');
const multer = require('multer');

const UsuarioController = require('../controllers/UsuarioController');
const AuthController = require('../controllers/AuthController')
const ExemplarController = require('../controllers/ExemplarController');
const ImagemController = require('../controllers/ImagemController');
const AnuncioController = require('../controllers/AnuncioController');

const uploadConfig = require('../config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);

// Auth
routes.post('/login', AuthController.login);
routes.post('/validate', AuthController.TokenValido);

// Usuario
routes.get('/usuario', UsuarioController.list);
routes.post('/usuario', UsuarioController.store);
routes.delete('/usuario/:usr_id', UsuarioController.delete);

// Exemplar
routes.post('/exemplar', ExemplarController.store);
routes.delete('/exemplar/:exm_id', ExemplarController.delete);

// Imagem
routes.post('/exemplar/:exm_id/imagem', upload.array('imagens'), ImagemController.store);
routes.delete('/imagem/:img_id', ImagemController.delete);

// Anúncio
routes.get('/anuncio', AnuncioController.listAll)
routes.post('/usuario/:usr_id/exemplar/:exm_id/anuncio', AnuncioController.store);
routes.delete('/anuncio/:anc_id', AnuncioController.delete);

module.exports = routes;