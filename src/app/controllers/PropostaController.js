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
        const parsedImg = imagesView.render(query);
        return {...parsedImg, exm_id: query.exm_id};
      })
    );
    if(images.length === 0) {
      return res.status(400).json({ error: "Imagens não encontradas!" });
    }

    const usuarios = await Promise.all(
      propostas.map(async (prop) => {
        const query = await Usuario.findOne({where: {id: prop.usr_id}});
        return query;
      })
    );
    if(usuarios.length === 0) {
      return res.status(400).json({ error: "Usuários não encontrados!" });
    }

    const resp = propostas.map((prop) => {
      const exemps = exemplares.filter((exemp) => {
        return exemp.id === prop.exm_id
      });

      const user = usuarios.filter((usr) => {
        return usr.id === prop.usr_id
      });

      const image = images.filter((img) => {
        return img.exm_id === prop.exm_id
      })

      return {
        proposta: {
          prop_id: prop.id,
          prop_descricao: prop.prop_descricao,
        },
        exemplar: {
          exm_id: exemps[0].id,
          exm_titulo: exemps[0].exm_titulo,
          exm_genero: exemps[0].exm_genero,
          exm_autor: exemps[0].exm_autor,
          exm_editora: exemps[0].exm_editora,
          imagem: {
            img_id: image[0]?.id,
            url: image[0]?.url,
            exm_id: image[0]?.exm_id,
          }
        },
        usuario: {
          usr_id: user[0].id,
          usr_foto: user[0].usr_foto,
          usr_apelido: user[0].usr_apelido,
          usr_nome: user[0].usr_nome,
          usr_ender_uf: user[0].usr_ender_uf,
          usr_ender_cidade: user[0].usr_ender_cidade,
          usr_ender_bairro: user[0].usr_ender_bairro,
        },
      }
    })

    return res.json(resp);
  },
  
  async listOne(req, res) {
    const { prop_id } = req.params;

    const proposta = await Proposta.findOne({ where: { id: prop_id } });
    if(!proposta) {
      return res.status(400).json({ error: "Proposta não encontrada!" });
    }

    const exemplar = await Exemplar.findOne({ where: { id: proposta.exm_id } });
    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" });
    }

    const usuario = await Usuario.findOne({ where: { id: proposta.usr_id } })
    if(!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado!" });
    }

    const imagens = await Imagem.findAll({ where: { exm_id: exemplar.id } });
    if(!imagens) {
      return res.status(400).json({ error: "Imagens não encontradas!" });
    }
    const parsedImages = await Promise.all(
      imagens.map((img) => {
        return imagesView.render(img)
      })
    );
    exemplar.imagens = parsedImages;

    const resp = {
      proposta: {
        prop_id: proposta.id,
        prop_descricao: proposta.prop_descricao,
      },
      exemplar: {
        exm_id: exemplar.id,
        exm_titulo: exemplar.exm_titulo,
        exm_genero: exemplar.exm_genero,
        exm_autor: exemplar.exm_autor,
        exm_editora: exemplar.exm_editora,
        imagens: parsedImages,
      },
      usuario: {
        usr_id: usuario.id,
        usr_foto: usuario.usr_foto,
        usr_apelido: usuario.usr_apelido,
        usr_nome: usuario.usr_nome,
        usr_ender_uf: usuario.usr_ender_uf,
        usr_ender_cidade: usuario.usr_ender_cidade,
        usr_ender_bairro: usuario.usr_ender_bairro,
      },
    }

    return res.json(resp);
  },
}