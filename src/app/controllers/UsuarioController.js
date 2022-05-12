const Usuario = require('../model/Usuario');
const imagesView = require('../../views/images_view');
const passEncrypt = require('../middlewares/passEncrypt');

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
  
      data.usr_senha = await passEncrypt(data.usr_senha);

      const user = await Usuario.create(data);
        
      return res.json(user);  

    } catch(err) {
      console.log(err)
      return res.status(400).json({ error: "Falha no registro!" });
    }
  },

  async update(req, res) {
    try {
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
        usr_range_troca,
        usr_latitude,
        usr_longitude
      } = req.body;
      const usuario = await Usuario.findByPk(usr_id).catch();
      
      if(!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado!" });
      }
      
      data.usr_apelido ? usuario.usr_apelido = data.usr_apelido : null;
      data.usr_nome ? usuario.usr_nome = data.usr_nome : null;
      data.usr_cpf ? usuario.usr_cpf = data.usr_cpf : null;
      data.usr_ender_uf ? usuario.usr_ender_uf = data.usr_ender_uf : null;
      data.usr_ender_cep ? usuario.usr_ender_cep = data.usr_ender_cep : null;
      data.usr_ender_cidade ? usuario.usr_ender_cidade = data.usr_ender_cidade : null;
      data.usr_ender_bairro ? usuario.usr_ender_bairro = data.usr_ender_bairro : null;
      data.usr_range_troca ? usuario.usr_range_troca = data.usr_range_troca : null;
      data.usr_latitude ? usuario.usr_latitude = data.usr_latitude : null;
      data.usr_longitude ? usuario.usr_longitude = data.usr_longitude : null;
      
      if(imagem && usuario.usr_foto) {
        await unlinkAsync(path.join(__dirname, '..', '..', '..', 'uploads', usuario.usr_foto));
      }
      
      if(imagem) {
        usuario.usr_foto = imagem.filename;
      }

      const usr_fields = [
        'usr_foto',
        'usr_nome',
        'usr_cpf',
        'usr_ender_uf',
        'usr_ender_cep',
        'usr_ender_cidade',
        'usr_ender_bairro',
        'usr_range_troca',
        'usr_latitude',
        'usr_longitude'
      ];

      let fieldCount = 0;

      Object.keys(usuario.dataValues).forEach((key) => {
        usr_fields.forEach((field) => {
          if (key === field) {
            !!usuario.dataValues[key] && fieldCount++
          }
        })
      });

      console.log(fieldCount)
      if (fieldCount === 10) usuario.is_active = true

      await usuario.save();
      
      usuario.usr_senha = undefined;
      
      if(usuario.usr_foto) {
        usuario.usr_foto = imagesView.renderUserImage(usuario.usr_foto)
      }
        
      return res.json(usuario); 

    } catch (err) {
      console.log(err)
      return res.status(400).send({error: "Ocorreu um erro ao tentar atualizar o usuário!"})
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