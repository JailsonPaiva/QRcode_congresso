const express = require('express');
const app = express();
const path = require('path')
const BodyParser = require('body-parser')
const qr = require('qr-image');
const aluno = require('./models/aluno');


// TEMPLATE ENGINE
    app.set('view engine', 'ejs')

// STATIC FILES
    app.use(express.static(path.join(__dirname, 'public')))

// BODY PARSER
    app.use(BodyParser.urlencoded({extended: true}))
    app.use(BodyParser.json())

// ROUTES
    app.get('/', (req, res) => res.render('home'))

    app.post('/criado', (req, res) => {
        const ra = req.body.ra
        const nome = req.body.nome

        if(!ra) {
            res.send('Preencha o campos')
        } else {
            aluno.findAll({
                attributes: ['id', 'nome', 'ra', 'curso', 'inscrito'],
                where: {ra: req.body.ra}
            }).then((aluno) => {
                const Aluno = aluno[0].dataValues

                //  VERIFICAÇÃO SE O ALUNO É INSCRITO NO CONGRESSO
                if(Aluno.inscrito === 'T') {
                    const NomeAluno = Aluno.nome
                    const RaAluno = Aluno.ra
                    const CursoAluno = Aluno.curso

                    // console.log(aluno[0].dataValues.nome)

                    const NewQrcode = {
                        code: (`${NomeAluno} ${RaAluno} ${CursoAluno}`)
                    }
        
                    const code = qr.image(NewQrcode.code, {type: 'svg'})
        
                    res.type('svg')
                    code.pipe(res)
                } else {
                    res.send('Aluno não inscrito no congresso.')
                }
                
                
            }).catch(err => {console.error(err)})
        }

        // 
        
        // const NewQrcode = {
        //     code: req.body.nome + " " + req.body.ra
        // }

        // const code = qr.image(NewQrcode.code, { type: 'svg'})

        // res.type('svg')
        // code.pipe(res)
    })

// QRCODE EXEMPLO 
// app.get('/qrcode', (req, res) => {
//     const url = "https://fasipecpa.com.br"
    
//     const code = qr.image(url, { type: 'svg' })
//     res.type('svg')
//     code.pipe(res)
// })


// PORT SERVER 
    app.listen(8080, () => {console.log('Server running.')})
