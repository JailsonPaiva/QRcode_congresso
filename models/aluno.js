const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Aluno = new Schema({
	nome: {
		type: String,
		require: true  // se ela vai ser obrigatorio ou não,
	},
	ra: {
		type: Number,
		require: true  // se ela vai ser obrigatorio ou não,
	},
	curso: {
		type: String,
		require: true  // se ela vai ser obrigatorio ou não,
	},
    inscrito: {
		type: String,
		require: true  // se ela vai ser obrigatorio ou não,
	}
})

mongoose.model("alunom", Aluno)



// const db = require('./db')
// const DataTypes = require('sequelize')

// const aluno = db.sequelize.define('alunos', {
//     // id: {
//     //     type: db.sequelize.NUMBER
//     // },
//     nome: {
//         type: DataTypes.TEXT
//     },
//     curso: {
//         type: DataTypes.TEXT
//     },
//     ra: {
//         type: DataTypes.NUMBER
//     }
// })

// module.exports = aluno