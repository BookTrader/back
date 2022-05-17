const { Model, DataTypes } = require('sequelize');

class Proposta extends Model {
  static init(sequelize) {
    super.init(
      {
        prop_descricao: DataTypes.STRING,
      }, {
        sequelize, freezeTableName: true, modelName: 'proposta'
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.usuario, { foreignKey: 'usr_id', as: 'usuario' })
    this.belongsTo(models.exemplar, { foreignKey: 'exm_id', as: 'exemplar' })
    this.belongsTo(models.anuncio, { foreignKey: 'anc_id', as: 'anuncio' })
  }
}

module.exports = Proposta;