const express = require('express');
const app = express();
const path = require('path')
const BodyParser = require('body-parser')
const qr = require('qr-image');
const QRcode = require('qrcode')
const aluno = require('./models/aluno');
const mongoose = require('mongoose')
const Aluno = mongoose.model("alunom")
require('./models/aluno')
const db = require('./models/db')


const port = process.env.PORT || 3000;

// TEMPLATE ENGINE
    app.set('view engine', 'ejs')

// STATIC FILES
    app.use(express.static(path.join(__dirname, 'public')))

// BODY PARSER
    app.use(BodyParser.urlencoded({extended: true}))
    app.use(BodyParser.json())

// MONGODB
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then( () => {
        console.log('MongoDB conectado...')
    }).catch( (erro) => {
        console.log(`O ocorreu um erro: ${erro}`)
    })

// ROUTES
    app.get('/', (req, res) => {res.render('home')})

    app.post('/ler', (req, res) => {
        const ra = req.body.ra
        // console.log(ra)

        if(ra === null || ra === "" || ra === undefined || ra.length < 5) {
            res.render('negado')
        } else {
            Aluno.findOne({ra: ra}).then((aluno) => {
                //  VERIFICAÇÃO SE O ALUNO É INSCRITO NO CONGRESSO
                const alunos = aluno
                
                if (alunos === null) {
                    res.render('negado')
                } else if(alunos.inscrito == 'T') {
                    const NomeAluno = alunos.nome
                    const RaAluno = alunos.ra
                    const CursoAluno = alunos.curso

                    const NewQrcode = {
                        code: (`${NomeAluno} ${RaAluno} ${CursoAluno}`)
                    }

                    QRcode.toDataURL(NewQrcode.code, (err, data) => {
                        const DataCode = data
                        // console.log(DataCode)
                        res.render('verificado', {code: DataCode, aluno: alunos})
                        
                    })
                } else if(alunos.inscrito == 'F') {
                    res.render('negado')
                }
            }).catch()
        } 
    })

    // app.post('/criado', (req, res) => {
    //     const ra = req.body.ra
    //     const nome = req.body.nome

    //     if(!ra) {
    //         res.send('Preencha o campos')
    //     } else {
    //         aluno.findAll({
    //             attributes: ['id', 'nome', 'ra', 'curso', 'inscrito'],
    //             where: {ra: req.body.ra}
    //         }).then((aluno) => {
    //             const Aluno = aluno[0].dataValues

    //             //  VERIFICAÇÃO SE O ALUNO É INSCRITO NO CONGRESSO
    //             if(Aluno.inscrito === 'T') {
    //                 const NomeAluno = Aluno.nome
    //                 const RaAluno = Aluno.ra
    //                 const CursoAluno = Aluno.curso

    //                 // console.log(aluno[0].dataValues.nome)

    //                 const NewQrcode = {
    //                     code: (`${NomeAluno} ${RaAluno} ${CursoAluno}`)
    //                 }
        

    //                 QRcode.toDataURL(NewQrcode.code, (err, data) => {
    //                     const DataCode = data
    //                     // console.log(DataCode)
    //                     res.render('verificado', {code: DataCode, aluno: Aluno})
    //                 })

    //             } else {
    //                 res.send('Aluno não inscrito no congresso.')
    //             }
                
                
    //         }).catch(err => {console.error(err)})
    //     }
        
    // })

// QRCODE EXEMPLO 
// app.get('/qrcode', (req, res) => {
//     const url = "https://fasipecpa.com.br"
    
//     const code = qr.image(url, { type: 'svg' })
//     res.type('svg')
//     code.pipe(res)
// })


// PORT SERVER 
    app.listen(port)