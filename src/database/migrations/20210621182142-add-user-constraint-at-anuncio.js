'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('anuncio', 'usr_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('anuncio', 'usr_id');
  }
};
