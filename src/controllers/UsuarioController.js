const Usuario = require('../model/Usuario');
const bcrypt = require('bcrypt');
const imagesView = require('../views/images_view');

const fs = require('fs')
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

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

  async update(req, res) {
    const { usr_id } = req.params;
    const imagem = req.file;
    const data = {
      usr_apelido,
      usr_nome,
      usr_cpf,
      usr_ender_uf,
      usr_ender_cep,
      usr_ender_cidade,
      usr_ender_bairro,
      usr_range_troca
    } = req.body;

    const usuario = await Usuario.findByPk(usr_id);

    if(!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado!" });
    }
    
    usuario.usr_apelido = data.usr_apelido;
    usuario.usr_nome = data.usr_nome;
    usuario.usr_cpf = data.usr_cpf;
    usuario.usr_ender_uf = data.usr_ender_uf;
    usuario.usr_ender_cep = data.usr_ender_cep;
    usuario.usr_ender_cidade = data.usr_ender_cidade;
    usuario.usr_ender_bairro = data.usr_ender_bairro;
    usuario.usr_range_troca = data.usr_range_troca;

    if(imagem && usuario.usr_foto) {
      await unlinkAsync(path.join(__dirname, '..', '..', 'uploads', usuario.usr_foto));
    }
    
    if(imagem) {
      data.usr_foto = imagem.filename;
      usuario.usr_foto = data.usr_foto;
    }

    const updatedUser = await usuario.save();
    
    updatedUser.usr_senha = undefined;
    
    if(updatedUser.usr_foto){
      updatedUser.usr_foto = imagesView.renderUserImage(updatedUser.usr_foto)
    }
      
    return res.json(updatedUser); 
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