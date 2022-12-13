const express = require('express')
const app = express()

const path = require('path')
// Initialize rendering engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Static file usage - CSS, JS, Images
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index')})
app.listen(3001)