const Exemplar = require('../model/Exemplar');
const Imagem = require('../controllers/ImagemController');

module.exports = {
  async store(req, res) {
    const data = { 
      exm_titulo,
      exm_genero,
      exm_autor,
      exm_editora,
      exm_ano,
      exm_condicao
    } = req.body;

    const exemplar = await Exemplar.create(data);

    return res.status(201).json(exemplar);
  },

  async delete(req, res) {
    const { exm_id } = req.params;

    const exemplar = await Exemplar.findByPk(exm_id)

    if(!exemplar) {
      return res.status(400).json({ error: "Exemplar não encontrado!" })
    }
    
    await Imagem.deleteWhere(exm_id);
    await exemplar.destroy().then(() => {
      return res.json({ message: "Exemplar excluido com sucesso!" })
    });
  }
}
