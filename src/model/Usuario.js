const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      usr_apelido: DataTypes.STRING,
      usr_nome: DataTypes.STRING,
      usr_foto: DataTypes.BLOB,
      usr_cpf: DataTypes.INTEGER,
      usr_ender_uf: DataTypes.STRING,
      usr_ender_cep: DataTypes.INTEGER,
      usr_ender_cidade: DataTypes.STRING,
      usr_ender_bairro: DataTypes.STRING,
      usr_email: DataTypes.STRING,
      usr_senha: DataTypes.STRING,
      usr_range_troca: DataTypes.FLOAT,
      usr_latitude: DataTypes.FLOAT,
      usr_longitude: DataTypes.FLOAT
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.hasMany(models.anuncio, { foreignKey: 'usr_id', as: 'imagens' })
  }
}

module.exports = Usuario;