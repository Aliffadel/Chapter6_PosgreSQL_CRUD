const Users = require('./users')
const Biodata = require('./user_game_biodata')
const History = require('./user_game_history')


// definisikan relasi
// user punya banyak (hasMany) cats
// user adalah parent dari cats
Users.hasOne(Biodata, {
  foreignKey: 'user_uuid',
  as: 'user_game_biodata'
})

// cats adalah kepemilikan dari (belongsTo) users
// cats adalah children dari user
Biodata.belongsTo(Users, {
  foreignKey: 'user_uuid',
  as: 'users'
})

Users.hasOne(History, {
  foreignKey: 'user_uuid',
  as: 'user_game_history'
})

History.belongsTo(Users, {
  foreignKey: 'user_uuid',
  as: 'users'
})

module.exports = {
  Users,
  Biodata,
  History
}