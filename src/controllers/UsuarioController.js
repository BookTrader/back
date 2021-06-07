const Usuario = require('../model/Usuario');

module.exports = {
  async list (req, res) {
    const usuarios = await Usuario.findAll();

    return res.json(usuarios);
  },

  async store(req, res) {
    const { 
      usr_apelido,
      usr_nome,
      usr_foto,
      usr_cpf,
      usr_ender_uf,
      usr_ender_cep,
      usr_ender_cidade,
      usr_ender_bairro,
      usr_email,
      usr_senha,
      usr_range_troca,
      usr_latitude,
      usr_longitude
    } = req.body;

    const user = await Usuario.create({ 
      usr_apelido,
      usr_nome,
      usr_foto,
      usr_cpf,
      usr_ender_uf,
      usr_ender_cep,
      usr_ender_cidade,
      usr_ender_bairro,
      usr_email,
      usr_senha,
      usr_range_troca,
      usr_latitude,
      usr_longitude
    });

    return res.json(user);
  }
}