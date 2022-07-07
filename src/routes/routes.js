const express = require('express');
const multer = require('multer');

const UsuarioController = require('../app/controllers/UsuarioController');
const AuthController = require('../app/controllers/AuthController')
const ExemplarController = require('../app/controllers/ExemplarController');
const ImagemController = require('../app/controllers/ImagemController');
const AnuncioController = require('../app/controllers/AnuncioController');
const PropostaController = require('../app/controllers/PropostaController');
const TrocaController = require('../app/controllers/TrocaController');

const uploadConfig = require('../config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);

// Auth
routes.post('/login', AuthController.login);
routes.post('/validate', AuthController.TokenValido);
routes.post('/forgot_password', AuthController.forgot_password);
routes.post('/reset_password', AuthController.reset_password);

// Usuario
routes.get('/usuario', UsuarioController.list);
routes.post('/usuario', UsuarioController.store);
routes.patch('/usuario/:usr_id', upload.single('imagem'), UsuarioController.update)
routes.delete('/usuario/:usr_id', UsuarioController.delete);

// Exemplar
routes.post('/usuario/:usr_id/exemplar', ExemplarController.store);
routes.get('/exemplar', ExemplarController.list);
routes.get('/exemplar/:exm_id', ExemplarController.listOne);
routes.get('/usuario/:usr_id/exemplar', ExemplarController.findUserExemplares);
routes.delete('/exemplar/:exm_id', ExemplarController.delete);

// Imagem
routes.post('/exemplar/:exm_id/imagem', upload.array('imagens', 5), ImagemController.store);
routes.delete('/imagem/:img_id', ImagemController.delete);

// Anúncio
routes.get('/anuncio/all/:usr_id', AnuncioController.listAll);
routes.get('/anuncio/:anc_id', AnuncioController.listOne);
routes.get('/anuncio/usuario/:usr_id', AnuncioController.listMy);
routes.post('/usuario/:usr_id/exemplar/:exm_id/anuncio', AnuncioController.store);
routes.delete('/anuncio/:anc_id', AnuncioController.delete);
routes.get('/list/exemplar/usuario/:usr_id', AnuncioController.listAncExemp)

// Proposta
routes.post('/usuario/:usr_id/exemplar/:exm_id/anuncio/:anc_id/proposta', PropostaController.store);
routes.get('/anuncio/:anc_id/proposta', PropostaController.listAll);
routes.get('/proposta/:prop_id', PropostaController.listOne);

// Troca
routes.post('/anuncio/:anc_id/proposta/:prop_id/troca', TrocaController.create);
routes.get('/troca/:troca_id', TrocaController.listOne);
routes.get('/troca/usuario/:usr_id', TrocaController.listAll);

module.exports = routes;