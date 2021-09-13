'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('exemplar', 'usr_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'usuario', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('exemplar', 'usr_id');
  }
};
