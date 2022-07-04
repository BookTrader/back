'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'troca',
        'anc_usr_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'usuario', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      ),
      queryInterface.addColumn(
        'troca',
        'prop_usr_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'usuario', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'troca',
        'anc_usr_id',
      ),
      queryInterface.removeColumn(
        'troca',
        'prop_usr_id',
      ),
    ]);
  }
};
