'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'usuario',
        'usr_latitude',
        {
          type: Sequelize.DECIMAL(10, 8)
        }
      ),
      queryInterface.changeColumn(
        'usuario',
        'usr_longitude',
        {
          type: Sequelize.DECIMAL(10, 8)
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'usuario',
        'usr_latitude',
        {
          type: Sequelize.FLOAT
        }
      ),
      queryInterface.changeColumn(
        'usuario',
        'usr_latitude',
        {
          type: Sequelize.FLOAT
        }
      ),
    ]);
  }
};
