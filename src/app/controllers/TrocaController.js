const Troca = require('../model/Troca');
const Anuncio = require('../model/Anuncio');
const Proposta = require('../model/Proposta');

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
    await anuncio.save()

    return res.status(200).json({troca, anuncio});
  }
}