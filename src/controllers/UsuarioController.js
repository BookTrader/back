const Usuario = require('../model/Usuario');
const bcrypt = require('bcrypt');

module.exports = {
  async list (req, res) {
    const usuarios = await Usuario.findAll();

    return res.json(usuarios);
  },

  async store(req, res) {
    const data = { 
      usr_apelido,
      usr_email,
      usr_senha,
    } = req.body;

    try {
      if (await Usuario.findOne({where: { usr_email }})) {
        return res.status(409).send({ msg: "Email ja cadastrado!" })
      }
  
      bcrypt.hash(data.usr_senha, 10, async (errBcrypt, hash) => {
        if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
  
        data.usr_senha = hash;
  
        const user = await Usuario.create(data);
  
        return res.json(user);
      });
    } catch(err) {
      return res.status(400).json({ error: "Falha no registro!" });
    }
  },

  async delete(req, res) {
    const { usr_id } = req.params;

    const user = await Usuario.findByPk(usr_id);

    if(!user) {
      return res.json({ error: "Usuário não encontrado!" })
    }

    user.destroy().then(() => {
      return res.json({ message: "Usuário excluido com sucesso!" });
    })
  }
}