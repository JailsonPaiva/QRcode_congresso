const db = require('./db')
const DataTypes = require('sequelize')

const aluno = db.sequelize.define('alunos', {
    // id: {
    //     type: db.sequelize.NUMBER
    // },
    nome: {
        type: DataTypes.TEXT
    },
    curso: {
        type: DataTypes.TEXT
    },
    ra: {
        type: DataTypes.NUMBER
    }
})

module.exports = aluno