const Usuario = require('../model/Usuario');
const jwt = require('jsonwebtoken');

module.exports = {
  async login(req, res) {
    const {usr_email, usr_senha} = req.body;
    
    if (!usr_email) {
      return res.status(400).send({error: "Campo Email deve ser preenchido!"});
    }

    if (!usr_senha) {
      return res.status(400).send({error: "Campo Senha deve ser preenchido!"});
    }

    const usuario = await Usuario.findOne({where: {usr_email, usr_senha}});

    if (!usuario) {
      return res.status(400).send({error: "Email ou Senha incorretos!"});
    }

    usuario.usr_senha = undefined;

    const token = jwt.sign({id: usuario.id}, "user-teste", {
      expiresIn: "1h",
    });

    return res.send({usuario, token});
  }
}