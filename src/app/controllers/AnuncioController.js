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

    const usuarios = await Promise.all(
      anuncios.map(async (anun) => {
        const query = await Usuario.findOne({where: {id: anun.usr_id}});
        const returnQuery = {
          id: query.id,
          usr_apelido: query.usr_apelido,
          usr_foto: query.usr_foto,
          usr_ender_cidade: query.usr_ender_cidade,
          usr_ender_bairro: query.usr_ender_bairro,
          anc_id: anun.id,
        }
        return returnQuery;
      })
    );
    
    const imagens = imagesView.renderMany(images);
    
    return res.json({exemplares, imagens, anuncios, usuarios});
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

  async listOne(req, res) {
    const { anc_id } = req.params;
    
    const anuncio = await Anuncio.findByPk(anc_id);
    if(!anuncio) { return res.status(400).send({error: "Erro ao procurar anúncio!"}) }
    
    const usuario = await Usuario.findByPk(anuncio.usr_id);
    if(!usuario) { return res.status(400).send({error: "Erro ao procurar usuário!"}) }
    
    usuario.usr_senha = undefined;
    usuario.usr_foto ? usuario.usr_foto = imagesView.renderUserImage(usuario.usr_foto) : null;
    
    const exemplar = await Exemplar.findByPk(anuncio.exm_id);
    if(!exemplar) { return res.status(400).send({error: "Erro ao procurar exemplar!"}) }
    
    const exemplarFotos = await Imagem.findAll({where: { exm_id: exemplar.id }});
    if(!exemplarFotos) { return res.status(400).send({error: "Erro ao procurar fotos do exemplar!"}) }
    
    const imagens = imagesView.renderMany(exemplarFotos);
    
    exemplar.setDataValue('imagens', imagens);

    return res.json({anuncio, usuario, exemplar});
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