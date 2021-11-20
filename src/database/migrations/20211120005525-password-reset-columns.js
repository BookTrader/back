'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'usuario',
        'reset_token',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'usuario',
        'reset_token_expires',
        {
          type: Sequelize.DATE
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('usuario', 'reset_token'),
    queryInterface.removeColumn('usuario', 'reset_token_expires')
  }
};
