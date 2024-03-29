const Imagem = require('../model/Imagem')
const Exemplar = require('../model/Exemplar');

const fs = require('fs')
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

module.exports = {
  async store(req, res) {
    const { exm_id } = req.params;
    const requestPhoto = req.files;

    const exemplar = await Exemplar.findByPk(exm_id);

    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }

    const imagens = requestPhoto.map(image => {
      return { path: image.filename, exm_id: exm_id }
    });

    const imagem = await Imagem.bulkCreate(imagens)
    
    return res.json(imagem);
  },

  async delete(req, res) {
    const { img_id } = req.params;
    const imagem = await Imagem.findByPk(img_id);

    if(!imagem) {
      return res.status(400).json({ error: "Imagem não encontrada!" })
    }

    await unlinkAsync(path.join(__dirname, '..', '..', '..', 'uploads', imagem.path));
    await imagem.destroy().then(() => {
      return res.json({ message: "Imagem excluida com sucesso!" })
    });
  },

  async deleteWhere(exm_id) {
    const imagem = await Imagem.findAll({where: {exm_id: exm_id}});

    if(!imagem) {
      return JSON.parse({ error: "Imagem não encontrada!" });
    }

    imagem.map(image => {
      unlinkAsync(path.join(__dirname, '..', '..', '..', 'uploads', image.path));
    });
  }
}
