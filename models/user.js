const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

User.sync();

module.exports = User;