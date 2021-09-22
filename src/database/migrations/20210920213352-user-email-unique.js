'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    });
  }
};
