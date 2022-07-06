const Usuario = require('../model/Usuario')
const Exemplar = require('../model/Exemplar');
const Anuncio = require('../model/Anuncio');
const Imagem = require('../model/Imagem');

const imagesView = require('../../views/images_view');
const distanceCalc = require('../middlewares/distanceCalc');

module.exports = {
  async listAll(req, res) {
    const { usr_id } = req.params;

    const anuncios = await Anuncio.findAll();
    if(!anuncios) {
      return res.status(400).json({ error: "Anuncios não encontrados!" });
    }

    let loggedUser = null;
    if(usr_id) {
      loggedUser = await Usuario.findByPk(usr_id)
    }

    let returnAncs = [];
    await Promise.all(
      anuncios.map(async (anunc) => {
        const exemplar = await Exemplar.findByPk(anunc.exm_id);
        const imagem = await Imagem.findOne({where: { exm_id: exemplar.id }});
        const usuario = await Usuario.findOne({where: {id: anunc.usr_id}});
        if (loggedUser) {
          const loggedCoord = { lat: loggedUser.usr_latitude, lng: loggedUser.usr_longitude };
          const userCoord = { lat: usuario.usr_latitude, lng: usuario.usr_longitude };
          const range = await distanceCalc(loggedCoord, userCoord);

          if(range / 1000 > loggedUser.usr_range_troca) return
          console.log(range / 1000)
        }

        const returnUser = {
          id: usuario.id,
          usr_apelido: usuario.usr_apelido,
          usr_foto: usuario.usr_foto,
          usr_ender_cidade: usuario.usr_ender_cidade,
          usr_ender_bairro: usuario.usr_ender_bairro,
          usr_range_troca: usuario.usr_range_troca,
          anc_id: anunc.id,
        }

        const parsedImage = imagesView.render(imagem);

        exemplar.setDataValue('imagens', parsedImage);
        anunc.setDataValue('exemplares', exemplar);
        anunc.setDataValue('usuario', returnUser);

        returnAncs.push(anunc)
      })
    );
    if(!returnAncs) {
      return res.status(400).json({error: 'Erro ao buscar anúncios!'})
    }

    return res.json(returnAncs);
  },

  async listMy(req, res) {
    const { usr_id } = req.params;

    const anuncios = await Anuncio.findAll({where: {usr_id}});
    if(!anuncios) {
      return res.status(400).json({ error: "Anuncios não encontrados!" });
    };

    let exemplares = [];
    
    exemplares = await Promise.all(
      anuncios.map(async (anunc) => {
        const query = await Exemplar.findByPk(anunc.exm_id)
        return query;
      })
    );
    if(exemplares.length === 0) {
      return res.status(400).json({ error: "Exemplares não encontrados!" });
    };

    await Promise.all(
      exemplares.map(async (exemp) => {
        const query = await Imagem.findAll({where: { exm_id: exemp.id }});
        if(!query) { return res.status(400).send({error: "Erro ao procurar fotos do exemplar!"}) }
        
        const imagens = imagesView.renderMany(query);
        
        exemp.setDataValue('imagens', imagens);
      })
    );
    
    return res.json({exemplares, anuncios});
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