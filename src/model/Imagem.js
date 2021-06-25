const { Model, DataTypes } = require('sequelize');

class Imagem extends Model {
  static init(sequelize) {
    super.init({
      path: DataTypes.STRING,
    }, {
      sequelize, freezeTableName: true, modelName: 'imagem'
    })
  }

  static associate(models) {
    this.belongsTo(models.exemplar, { foreignKey: 'exm_id', as: 'exemplar' })
  }

}

module.exports = Imagem;