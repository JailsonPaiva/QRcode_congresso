const express = require('express');
const app = express();
const path = require('path')
const BodyParser = require('body-parser')
const qr = require('qr-image');

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
        const NewQrcode = {
            code: req.body.nome + " " + req.body.ra
        }

        const code = qr.image(NewQrcode.code, { type: 'svg'})

        res.type('svg')
        code.pipe(res)
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
