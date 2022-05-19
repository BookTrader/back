const Usuario = require('../model/Usuario');
const Exemplar = require('../model/Exemplar');
const Anuncio = require('../model/Anuncio');
const Proposta = require('../model/Proposta');
const Imagem = require('../model/Imagem');

const imagesView = require('../../views/images_view');

module.exports = {
  async store(req, res) {
    const { usr_id, exm_id, anc_id } = req.params;
    const { prop_descricao } = req.body;
    console.log(prop_descricao)
    const user = Usuario.findByPk(usr_id);
    if(!user) {
      return res.status(400).json({ error: "Usuario não encontrado!" });
    }

    const exemplar = Exemplar.findByPk(exm_id);
    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }

    const anuncio = Anuncio.findByPk(anc_id);
    if(!anuncio) {
      return res.status(400).json({ error: "Anúncio não encontrado!" })
    }

    const proposta = await Proposta.create({ prop_descricao, exm_id, usr_id, anc_id });
    
    return res.json(proposta);
  },

  async listAll(req, res) {
    const { anc_id } = req.params;
    
    const propostas = await Proposta.findAll({ where: { anc_id } });
    if(!propostas) {
      return res.status(400).json({ error: "Propostas não encontradas!" });
    }

    const exemplares = await Promise.all(
      propostas.map(async (prop) => {
        const query = await Exemplar.findByPk(prop.exm_id)
        return query;
      })
    );
    if(exemplares.length === 0) {
      return res.status(400).json({ error: "Exemplares não encontrados!" });
    }

    const images = await Promise.all(
      exemplares.map(async (exemp) => {
        const query = await Imagem.findOne({where: { exm_id: exemp.id }});
        return query;
      })
    );
    if(images.length === 0) {
      return res.status(400).json({ error: "Imagens não encontradas!" });
    }

    const usuarios = await Promise.all(
      propostas.map(async (prop) => {
        const query = await Usuario.findOne({where: {id: prop.usr_id}});
        const returnQuery = {
          id: query.id,
          usr_apelido: query.usr_apelido,
          usr_foto: query.usr_foto,
          usr_ender_cidade: query.usr_ender_cidade,
          usr_ender_bairro: query.usr_ender_bairro,
          anc_id: prop.id,
        }
        return returnQuery;
      })
    );
    if(usuarios.length === 0) {
      return res.status(400).json({ error: "Usuários não encontrados!" });
    }

    const imagens = imagesView.renderMany(images);

    return res.json({exemplares, imagens, propostas, usuarios});
  }
}