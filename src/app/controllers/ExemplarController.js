const Exemplar = require('../model/Exemplar');
const Usuario = require('../model/Usuario');
const Imagem = require('../model/Imagem');

const ImagemController = require('./ImagemController');

const imagesView = require('../../views/images_view');

module.exports = {
  async store(req, res) {
    const { 
      exm_titulo,
      exm_genero,
      exm_autor,
      exm_editora,
      exm_ano,
      exm_condicao
    } = req.body;
    const { usr_id } = req.params;

    const user = Usuario.findByPk(usr_id);

    if(!user) {
      return res.status(400).json({ error: "Usuario não encontrado!" });
    }

    const data = {
      exm_titulo,
      exm_genero,
      exm_autor,
      exm_editora,
      exm_ano,
      exm_condicao,
      usr_id
    }

    const exemplar = await Exemplar.create(data);

    return res.status(201).json(exemplar);
  },

  async list(req, res) {
    const exemplares = await Exemplar.findAll();

    return res.json(exemplares);
  },

  async findUserExemplares(req, res) {
    const { usr_id } = req.params;

    const exemplares = await Exemplar.findAll({where: {usr_id: usr_id}});
    
    if(!exemplares) {
      return res.status(400).json({ error: "Exemplares não encontrados!" });
    }

    await Promise.all(
      exemplares.map(async (exemp) => {
        const query = await Imagem.findAll({where: { exm_id: exemp.id }});
        if(!exemplarFotos) { return res.status(400).send({error: "Erro ao procurar fotos do exemplar!"}) }

        const imagens = imagesView.renderMany(query);

        exemp.setDataValue('imagens', imagens);
      })
    );

    return res.status(201).json(exemplares);
  },

  async delete(req, res) {
    const { exm_id } = req.params;

    const exemplar = await Exemplar.findByPk(exm_id)

    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }
    
    await ImagemController.deleteWhere(exm_id);
    await exemplar.destroy().then(() => {
      return res.json({ message: "Exemplar excluido com sucesso!" })
    });
  }
}
