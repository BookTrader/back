'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_foto', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('usuario', 'usr_foto', {
      type: Sequelize.BLOB,
      allowNull: false
    });
  }
};
