'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_ender_cep', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_ender_cep', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};