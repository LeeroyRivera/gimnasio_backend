const sequelize = require('sequelize');

const db = new sequelize.Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', 
  protocol: 'postgres',
});
module.exports = db;