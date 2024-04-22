const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  // ... Otras columnas
});

// Asociaciones con otros modelos
// User.hasMany(Post);

User.sync(); // Sincronizar el modelo con la base de datos

module.exports = User;
