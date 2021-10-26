'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_range_troca', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_range_troca', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};