const { Model, DataTypes } = require('sequelize');

class Exemplar extends Model {
  static init(sequelize) {
    super.init(
      {
        exm_titulo: DataTypes.STRING,
        exm_genero: DataTypes.STRING,
        exm_autor: DataTypes.STRING,
        exm_editora: DataTypes.STRING,
        exm_ano: DataTypes.INTEGER,
        exm_condicao: DataTypes.STRING,
      }, {
        sequelize, freezeTableName: true, modelName: 'exemplar'
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.usuario, { foreignKey: 'usr_id', as: 'usuario' })
    this.hasMany(models.imagem, { foreignKey: 'exm_id', as: 'imagens' })
    this.hasOne(models.anuncio, { foreignKey: 'exm_id', as: 'anuncio' })
  }
}



module.exports = Exemplar;