const Troca = require('../model/Troca');
const Anuncio = require('../model/Anuncio');
const Proposta = require('../model/Proposta');
const Usuario = require('../model/Usuario');

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

    const troca = await Troca.create({anc_id, prop_id})
    if(!troca) {
      return res.status(400).json({ error: "Erro ao criar troca!" });
    }

    anuncio.status = 'closed';
    await anuncio.save();

    return res.status(200).json({troca, anuncio});
  },

  async listOne(req, res) {
    const { anc_id } = req.params;

    const troca = await Troca.findOne({ where: { anc_id } });
    if(!troca) {
      return res.status(400).json({ error: "Troca não encontrado!" });
    }

    const anuncio = await Anuncio.findByPk(troca.anc_id);
    if(!anuncio) {
      return res.status(400).json({ error: "Anúncio não encontrado!" });
    }
    const anc_user = await Usuario.findByPk(anuncio.usr_id);
    if(!anc_user) {
      return res.status(400).json({ error: "Usuário do anúncio não encontrado!" });
    }
    anc_user.usr_senha = undefined

    const proposta = await Proposta.findByPk(troca.prop_id);
    if(!proposta) {
      return res.status(400).json({ error: "Proposta não encontrada!" });
    }
    const prop_user = await Usuario.findByPk(proposta.usr_id);
    if(!prop_user) {
      return res.status(400).json({ error: "Usuário do anúncio não encontrado!" });
    }
    prop_user.usr_senha = undefined

    const data = {
      troca,
      anuncio: {
        anc_id: anuncio.id,
        anc_descricao: anuncio.anc_descricao,
        status: anuncio?.status,
        exm_id: anuncio.exm_id,
        anc_user,
      },
      proposta: {
        prop_id: proposta.id,
        prop_descricao: proposta.prop_descricao,
        exm_id: proposta.exm_id,
        anc_id: proposta.anc_id,
        prop_user,
      }
    }

    return res.status(200).json(data)
  }
}