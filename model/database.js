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
