const Usuario = require('../model/Usuario')
const Exemplar = require('../model/Exemplar');
const Anuncio = require('../model/Anuncio');

module.exports = {
  async store(req, res) {
    const { usr_id, exm_id } = req.params;
    const { anc_descricao } = req.body;

    const user = Usuario.findByPk(usr_id);

    if(!user) {
      return res.status(400).json({ error: "Usuario não encontrado!" })
    }

    const exemplar = Exemplar.findByPk(exm_id);

    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }

    const anuncio = await Anuncio.create({ anc_descricao, exm_id, usr_id });
    console.log(anuncio);
    
    return res.json(anuncio);
  },

  async delete(req, res) {
    const { anc_id } = req.params;

    const anuncio = await Anuncio.findByPk(anc_id)

    if(!anuncio) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }
    
    await anuncio.destroy().then(() => {
      return res.json({ message: "Anúncio excluido com sucesso!" })
    });
  }
}