const Sequelize = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

module.exports = sequelize;
