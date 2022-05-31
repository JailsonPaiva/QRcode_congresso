// const mysql = require("mysql");

const database = {
    host: "fasipecpa.com.br",
    user: "fasipecp_ads",
    password: "Ry[gopYTw?Ca@*Hwvr",
    database: "fasipecp_ads",
};

// database.connect((erro) => {
//     if (erro) {
//         throw erro;
//     } else {
//         console.log("Conexão com o banco de dados estabelecida...");
//     }
// });

// global.database = database;
// module.exports = database;

const Sequelize = require('sequelize')
const sequelize = new Sequelize(database.database, database.user, database.password, {
    dialect: 'mysql',
    host: database.host
})

module.exports = sequelize