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
    this.belongsTo(models.anuncio, { foreignKey: 'anc_usr_id', as: 'anuncio_usr' })
    this.belongsTo(models.proposta, { foreignKey: 'prop_id', as: 'proposta' })
    this.belongsTo(models.proposta, { foreignKey: 'prop_usr_id', as: 'proposta_usr' })
  }
}

module.exports = Troca;