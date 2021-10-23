'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_cpf', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_cpf', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
