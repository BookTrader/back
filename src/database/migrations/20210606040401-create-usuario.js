'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usr_apelido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usr_nome: {
        type: Sequelize.STRING,
        allowNull: true
      },
      usr_foto: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      usr_cpf: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      usr_ender_uf :{
        type: Sequelize.STRING,
        allowNull: true
      },
      usr_ender_cep: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      usr_ender_cidade: {
        type: Sequelize.STRING,
        allowNull: true
      },
      usr_ender_bairro: {
        type: Sequelize.STRING,
        allowNull: true
      },
      usr_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usr_senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usr_range_troca: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      usr_latitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      usr_longitude: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('usuario');
  }
};
