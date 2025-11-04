const sequelize = require('sequelize');
const {USUARIO_DB, CONTRASENA_DB, NOMBRE_DB} = process.env;
const db =  new sequelize(
    NOMBRE_DB,
    USUARIO_DB,
    CONTRASENA_DB,
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql'
    }
    );

    module.exports = db;