const { Sequelize, DataTypes, Model, } = require('sequelize');
const sequelize = require('../config/db')

const db = {};
  db.Sequelize=sequelize;
  db.sequelize=sequelize;

db.user = require('./user')(sequelize,DataTypes,Model)
db.contact = require('./contact')(sequelize,DataTypes)
db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact)
db.addUser = require('./addUser')(sequelize,DataTypes,Model)

//db.user.hasOne(db.contact,{foreignKey: 'user_id',as:'contactDetails'});

// db.user.hasMany(db.contact,{foreignKey: 'user_id',as:'contactDetails'});
// db.contact.belongsTo(db.user,{foreignKey: 'user_id',as:'userDetails'});

// db.user.belongsToMany(db.contact, { through: db.userContacts });
// db.contact.belongsToMany(db.user, { through: db.userContacts });

db.sequelize.sync({ force:true});
module.exports=db;