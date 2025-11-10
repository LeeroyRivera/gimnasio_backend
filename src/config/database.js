const sequelize = require('sequelize');

const db = new sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  dialect: 'mysql', 
  protocol: 'mysql',
  logging: false
});
module.exports = db;*/