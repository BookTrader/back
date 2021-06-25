'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.createTable('exemplar', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      exm_titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exm_genero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exm_autor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exm_editora: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      exm_ano: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      exm_condicao: {
        type: Sequelize.STRING,
        allowNull: false,
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

    return queryInterface.dropTable('exemplar');

  }
};
