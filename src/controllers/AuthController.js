const Usuario = require('../model/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const imagesView = require('../views/images_view');

module.exports = {
  async login(req, res) {
    const {usr_email, usr_senha} = req.body;

    const usuario = await Usuario.findOne({where: {usr_email}});

    if (!usuario) {
      return res.status(400).send({error: "Email ou Senha incorretos!"});
    }

    bcrypt.compare(usr_senha, usuario.usr_senha, (err, result) => {
      if (err) {
        return res.status(401).send({ msg: "Falha na autenticação!" })
      }

      if (result) {
        usuario.usr_senha = undefined;
    
        const token = jwt.sign(
          {id: usuario.id}, 
          "cachoeira", 
          {expiresIn: "1h"}
        );

        if(usuario.usr_range_troca) {
          usuario.usr_range_troca = [usuario.usr_range_troca];
        }

        if(usuario.usr_foto){
          usuario.usr_foto = imagesView.renderUserImage(usuario.usr_foto)
        }

        return res.send({usuario, token});
      }

      return res.status(401).send({ msg: "Falha na autenticação!" });
    });
  },

  async TokenValido(req, res){
    const token = req.body.token || ''

    jwt.verify(token, "cachoeira", function(err, decoded){
      return res.status(200).send({valid: !err})
    })
  }
}