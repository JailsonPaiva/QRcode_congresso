const database = {
    host: "fasipecpa.com.br",
    user: "fasipecp_ads",
    password: "Ry[gopYTw?Ca@*Hwvr",
    database: "fasipecp_ads",
};


// DATABASE MYSQL
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(database.database, database.user, database.password, { 
    host: database.host,
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log("Database is initialized")
}).catch(err => {
    console.log("Falha ao conectar" + err)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    DataTypes: DataTypes
} 




// const mysql = require("mysql");

// database.connect((erro) => {
//     if (erro) {
//         throw erro;
//     } else {
//         console.log("Conexão com o banco de dados estabelecida...");
//     }
// });

global.database = database;
module.exports = database;

// const Sequelize = require('sequelize')
// const sequelize = new Sequelize(database.database, database.user, database.password, {
//     dialect: 'mysql',
//     host: database.host
// })

// module.exports = sequelize