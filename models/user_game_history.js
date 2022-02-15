const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/databaseConnection')

class History extends Model { }

History.init({
  // Model attributes are defined here
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  win: DataTypes.INTEGER(255),
  lose: DataTypes.INTEGER(255),
  
  user_uuid: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'user_game_history', // We need to choose the model name,
  freezeTableName: true, // nama tabelnya tidak dirubah jadi bentuk jamak,
  createdAt: true,
  updatedAt: true,
});

module.exports = History