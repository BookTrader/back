const Imagem = require('../model/Imagem')
const Exemplar = require('../model/Exemplar');

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
  }
}