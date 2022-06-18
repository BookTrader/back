const { Model, DataTypes } = require('sequelize');

class Troca extends Model {
  static init(sequelize) {
    super.init(
      {}, {
        sequelize, freezeTableName: true, modelName: 'troca'
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.anuncio, { foreignKey: 'anc_id', as: 'anuncio' })
    this.belongsTo(models.proposta, { foreignKey: 'prop_id', as: 'proposta' })
  }
}

module.exports = Troca;