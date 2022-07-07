const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Usuario = require('../model/Usuario');
const imagesView = require('../../views/images_view');
const mailer = require('../../modules/mailer');
const passEncrypt = require('../middlewares/passEncrypt');

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
          {expiresIn: "24h"}
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
  },

  async forgot_password(req, res) {
    const { usr_email } = req.body;

    try {
      
      const user = await Usuario.findOne( {where: { usr_email }} );
      if (!user) {
        return res.status(400).send({error: "Usuário não encontrado!"});
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await Usuario.update(
        { reset_token: token, reset_token_expires: now },
        { where: { id: user.id } }
      ).catch(() => {
        return res.status(400).send({error: "Erro ao gerar token!"})
      });

      mailer.sendMail({
        to: usr_email,
        from: 'wkacrision@gmail.com',
        template: 'auth/forgot_password',
        context: {
          usr_apelido: user.usr_apelido,
          token
        }
      }, (err) => {
        if (err)
          return res.status(400).send({error: "Erro ao enviar email!"});

        return res.json()
      })

    } catch (err) {
      res.status(400).send({error: "Aconteceu algo de errado, tente novamente!"});
    }
  },

  async reset_password(req, res) {

    try {
      
      const {
        usr_email,
        token,
        usr_senha
      } = req.body;
  
      const user = await Usuario.findOne({where: { usr_email }});
      if (!user) {
        return res.status(400).send({error: "Usuário não encontrado!"});
      }
  
      if (user.reset_token !== token) {
        return res.status(400).send({error: "Token inválido!"});
      }
  
      const now = new Date;
  
      if (now > user.reset_token_expires) {
        return res.status(400).send({error: "Token expirado, gere um novo."});
      }
  
      const encPass = await passEncrypt(usr_senha);
      user.usr_senha = encPass;
  
      user.reset_token = null;
      user.reset_token_expires = null;
  
      await user.save();
  
      res.json();

    } catch (err) {
      res.status(400).send({error: "Aconteceu algo de errado, tente novamente!"});
    }

  }
}