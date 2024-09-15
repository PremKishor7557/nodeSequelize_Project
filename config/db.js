const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('employeedb', 'root', 'WJ32@krhps', {
    host: 'localhost',
    port: 3306, // Default MySQL port
    logging: false,
    dialect: 'mysql'/*mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;