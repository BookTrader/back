const Usuario = require('../model/Usuario')
const Exemplar = require('../model/Exemplar');
const Anuncio = require('../model/Anuncio');
const Imagem = require('../model/Imagem');

const imagesView = require('../../views/images_view');

module.exports = {
  async listAll(req, res) {
    const anuncios = await Anuncio.findAll();

    if(!anuncios) {
      return res.status(400).json({ error: "Anuncios não encontrados!" });
    }

    let exemplares = [];
    
    exemplares = await Promise.all(
      anuncios.map(async (anunc) => {
        const query = await Exemplar.findByPk(anunc.exm_id)
        return query;
      })
    );
    
    if(!exemplares.length) {
      return res.status(400).json({ error: "Exemplares não encontrados!" });
    }

    images = await Promise.all(
      exemplares.map(async (exemp) => {
        const query = await Imagem.findOne({where: { exm_id: exemp.id }});
        return query;
      })
    );

    const imagens = imagesView.renderMany(images);

    return res.json({exemplares, imagens, anuncios});
  },

  async store(req, res) {
    const { usr_id, exm_id } = req.params;
    const { anc_descricao } = req.body;

    const user = Usuario.findByPk(usr_id);

    if(!user) {
      return res.status(400).json({ error: "Usuario não encontrado!" });
    }

    const exemplar = Exemplar.findByPk(exm_id);

    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }

    const anuncio = await Anuncio.create({ anc_descricao, exm_id, usr_id });
    
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