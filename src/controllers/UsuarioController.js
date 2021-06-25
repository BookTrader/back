const Usuario = require('../model/Usuario');

module.exports = {
  async list (req, res) {
    const usuarios = await Usuario.findAll();

    return res.json(usuarios);
  },

  async store(req, res) {
    const data = { 
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

    const user = await Usuario.create(data);

    return res.json(user);
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