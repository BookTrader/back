const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      usr_apelido: DataTypes.STRING,
      usr_nome: DataTypes.STRING,
      usr_foto: DataTypes.STRING,
      usr_cpf: DataTypes.STRING,
      usr_ender_uf: DataTypes.STRING,
      usr_ender_cep: DataTypes.INTEGER,
      usr_ender_cidade: DataTypes.STRING,
      usr_ender_bairro: DataTypes.STRING,
      usr_email: DataTypes.STRING,
      usr_senha: DataTypes.STRING,
      usr_range_troca: DataTypes.FLOAT,
      usr_latitude: DataTypes.DECIMAL(10, 8),
      usr_longitude: DataTypes.DECIMAL(10, 8)
    }, {
      sequelize, freezeTableName: true, modelName: 'usuario'
    })
  }

  static associate(models) {
    this.hasMany(models.anuncio, { foreignKey: 'usr_id', as: 'anuncios' })
    this.hasMany(models.exemplar, { foreignKey: 'usr_id', as: 'exemplares' })
  }
}

module.exports = Usuario;