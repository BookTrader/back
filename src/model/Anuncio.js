const { Model, DataTypes } = require('sequelize');

class Anuncio extends Model {
  static init(sequelize) {
    super.init(
      {
        anc_descricao: DataTypes.STRING,
      }, {
        sequelize, freezeTableName: true, modelName: 'anuncio'
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usr_id', as: 'usuarios' })
    this.belongsTo(models.exemplar, { foreignKey: 'exm_id', as: 'exemplar' })
  }
}

module.exports = Anuncio;