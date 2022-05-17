const Usuario = require('../model/Usuario');
const Exemplar = require('../model/Exemplar');
const Anuncio = require('../model/Anuncio');
const Proposta = require('../model/Proposta');

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
  }
}