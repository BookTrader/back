const Troca = require('../model/Troca');
const Anuncio = require('../model/Anuncio');
const Exemplar = require('../model/Exemplar');
const Imagem = require('../model/Imagem');
const Proposta = require('../model/Proposta');
const Usuario = require('../model/Usuario');

const imagesView = require('../../views/images_view');

module.exports = {
  async create(req, res) {
    const { anc_id, prop_id } = req.params;

    const anuncio = await Anuncio.findByPk(anc_id);
    if(!anuncio) {
      return res.status(400).json({ error: "Anúncio não encontrado!" });
    }
    if(anuncio?.status == 'closed') {
      return res.status(400).json({ error: "Anúncio fechado!" });
    }

    const proposta = await Proposta.findByPk(prop_id);
    if(!proposta) {
      return res.status(400).json({ error: "Proposta não encontrada!" });
    }
    if(proposta?.anc_id != anc_id) {
      return res.status(400).json({ error: "Proposta e anúncio diferem!" });
    }

    const troca = await Troca.create({anc_id, prop_id, anc_usr_id: anuncio.usr_id, prop_usr_id: proposta.usr_id})
    if(!troca) {
      return res.status(400).json({ error: "Erro ao criar troca!" });
    }

    anuncio.status = 'closed';
    await anuncio.save();

    return res.status(200).json({troca, anuncio});
  },

  async listOne(req, res) {
    const { troca_id } = req.params;

    const troca = await Troca.findByPk(troca_id);
    if(!troca) {
      return res.status(400).json({ error: "Troca não encontrada!" });
    }

    const anuncio = await Anuncio.findByPk(troca.anc_id);
    if(!anuncio) {
      return res.status(400).json({ error: "Anúncio não encontrado!" });
    }
    const anc_exm = await Exemplar.findByPk(anuncio.exm_id);
    if(!anc_exm) {
      return res.status(400).json({ error: "Exemplar do anúncio não encontrado!" });
    }
    const anc_exm_img = await Imagem.findOne( {where: { exm_id: anc_exm.id }} );
    if(!anc_exm_img) {
      return res.status(400).json({ error: "Imagens do exemplar do anúncio não encontrado!" });
    }
    anc_exm.setDataValue('imagem', imagesView.render(anc_exm_img));
    const anc_user = await Usuario.findByPk(anuncio.usr_id);
    if(!anc_user) {
      return res.status(400).json({ error: "Usuário do anúncio não encontrado!" });
    };
    anc_user.usr_senha = undefined;

    const proposta = await Proposta.findByPk(troca.prop_id);
    if(!proposta) {
      return res.status(400).json({ error: "Proposta não encontrada!" });
    }
    const prop_exm = await Exemplar.findByPk(proposta.exm_id);
    if(!prop_exm) {
      return res.status(400).json({ error: "Exemplar da proposta não encontrado!" });
    }
    const prop_exm_img = await Imagem.findOne( {where: { exm_id: prop_exm.id }} );
    if(!prop_exm_img) {
      return res.status(400).json({ error: "Imagens do proposta do anúncio não encontrado!" });
    }
    prop_exm.setDataValue('imagem', imagesView.render(prop_exm_img));
    const prop_user = await Usuario.findByPk(proposta.usr_id);
    if(!prop_user) {
      return res.status(400).json({ error: "Usuário da proposta não encontrado!" });
    }
    prop_user.usr_senha = undefined

    const data = {
      troca,
      anuncio: {
        anc_id: anuncio.id,
        anc_descricao: anuncio.anc_descricao,
        status: anuncio?.status,
        anc_exm,
        anc_user,
      },
      proposta: {
        prop_id: proposta.id,
        prop_descricao: proposta.prop_descricao,
        anc_id: proposta.anc_id,
        prop_exm,
        prop_user,
      }
    }

    return res.status(200).json(data)
  },

  async listAll(req, res) {
    const { usr_id } = req.params;

    const usuario = await Usuario.findByPk(usr_id);
    if(!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado!" });
    };

    const trocaAnc = await Troca.findAll({ where: { anc_usr_id: usr_id } })
    const trocaProp = await Troca.findAll({ where: { prop_usr_id: usr_id } })

    let trocaPayloadAnc = [];
    trocaPayloadAnc = await Promise.all(
      trocaAnc.map(async (troca) => {
        const anuncio = await Anuncio.findByPk(troca.anc_id)
        const proposta = await Proposta.findByPk(troca.prop_id)
        const exemplarAnc = await Exemplar.findByPk(anuncio.exm_id)
        const exemplarProp = await Exemplar.findByPk(proposta.exm_id)
        const usuarioAnc = await Usuario.findByPk(anuncio.usr_id)
        const usuarioProp = await Usuario.findByPk(proposta.usr_id)

        anuncio.setDataValue('exemplar', exemplarAnc)
        anuncio.setDataValue('usuario', usuarioAnc)
        proposta.setDataValue('exemplar', exemplarProp)
        proposta.setDataValue('usuario', usuarioProp)

        return {troca, anuncio, proposta};
      })
    );
    let trocaPayloadProp = [];
    trocaPayloadProp = await Promise.all(
      trocaProp.map(async (troca) => {
        const proposta = await Proposta.findByPk(troca.prop_id)
        const anuncio = await Anuncio.findByPk(troca.anc_id)
        const exemplarProp = await Exemplar.findByPk(proposta.exm_id)
        const exemplarAnc = await Exemplar.findByPk(anuncio.exm_id)
        const usuarioProp = await Usuario.findByPk(proposta.usr_id)
        const usuarioAnc = await Usuario.findByPk(anuncio.usr_id)

        anuncio.setDataValue('exemplar', exemplarAnc)
        anuncio.setDataValue('usuario', usuarioAnc)
        proposta.setDataValue('exemplar', exemplarProp)
        proposta.setDataValue('usuario', usuarioProp)

        return {troca, anuncio, proposta};
      })
    );

    let trocaReturn = trocaPayloadAnc.concat(trocaPayloadProp);

    return res.status(200).json(trocaReturn)
  }
}