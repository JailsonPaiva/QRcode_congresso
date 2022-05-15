const express = require('express');
const app = express();
const path = require('path')

const qr = require('qr-image');

// TEMPLATE ENGINE
app.set('view engine', 'ejs')

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES

app.get('/', (req, res) => res.render('home'))


    // QRCODE CREATED 
    app.get('/qrcode', (req, res) => {
        const url = "https://fasipecpa.com.br"
        
        const code = qr.image(url, { type: 'svg' })
        res.type('svg')
        code.pipe(res)
    })

// PORT SERVER 
app.listen(8080, () => {console.log('Server running.')})
