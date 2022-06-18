'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuario', 'usr_telefone', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('usuario', 'usr_telefone', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
