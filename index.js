/* jshint node: true */
"use strict"

const express = require('express')
const morgan = require('morgan')
const app = express()

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Vous êtes à l\'accueil, que puis-je pour vous ?')
})

app.get('/sous-sol', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Vous êtes dans la cave à vins, ces bouteilles sont à moi !')
})

app.get('/etage/1/chambre', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hé ho, c\'est privé ici !')
})

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/plain')
    res.status(404).send('Page introuvable !')
    next()
})

app.use(morgan('dev'))

app.listen(8080);