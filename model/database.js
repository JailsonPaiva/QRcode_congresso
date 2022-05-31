// const database = {
//     host: "fasipecpa.com.br",
//     user: "fasipecp_ads",
//     password: "Ry[gopYTw?Ca@*Hwvr",
//     database: "fasipecp_ads",
// };


// // DATABASE MYSQL
// const { Sequelize, DataTypes } = require('sequelize')

// const sequelize = new Sequelize(database.database, database.user, database.password, { 
//     host: database.host,
//     dialect: 'mysql'
// })

// sequelize.authenticate().then(() => {
//     console.log("Database is initialized")
// }).catch(err => {
//     console.log("Falha ao conectar" + err)
// })

// module.exports = {
//     Sequelize: Sequelize,
//     sequelize: sequelize,
//     DataTypes: DataTypes
// } 



const mysql = require("mysql");

const database = mysql.createConnection({
    host: "fasipecpa.com.br",
    user: "fasipecp_ads",
    password: "Ry[gopYTw?Ca@*Hwvr",
    port: 3306,
    database: "fasipecp_ads",
    multipleStatements: true
});

database.connect((erro) => {
    if (erro) {
        throw erro;
    } else {
        console.log("Conexão com o banco de dados estabelecida...");
    }
});

global.database = database;
module.exports = database; 