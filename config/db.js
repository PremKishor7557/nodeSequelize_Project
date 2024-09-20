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

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('employeedb', null, null, {
//   dialect: 'mysql',
//   logging: false, // Disable logging for production or debugging if needed
//   replication: {
//     read: [
//       {
//         host: 'localhost', // Docker service name for replica
//         port: 3307, // Port for replica (from docker-compose.yml)
//         username: 'user', // Same user for both master and replica
//         password: 'password', // Root password as per your setup
//       },
//     ],
//     write: {
//       host: 'localhost', // Docker service name for master
//       port: 3308, // Port for master (from docker-compose.yml)
//       username: 'user',
//       password: 'password',
//     },
//   },
//   pool: {
//     max: 10, // Maximum number of connections in pool
//     idle: 30000, // Remove idle connections after 30 seconds
//     acquire: 60000, // Timeout for acquiring a connection
//   },
// });

// try {
//   sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

// module.exports = sequelize;
