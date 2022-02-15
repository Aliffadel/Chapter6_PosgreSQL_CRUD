const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('user_game', 'postgres', 'aliffadel1', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

module.exports = sequelize

// untuk check koneksi
// const connect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// module.exports = connect

