// DATABASE MYSQL
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('congresso', 'root', '@123mudar', { 
    host: 'localhost',
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