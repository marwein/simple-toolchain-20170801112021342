/* jshint node: true */
"use strict"
const dotenv = require('dotenv')
dotenv.load()

const express = require('express')
const ent = require('ent')
const uuid = require('uuid/v4')
const morgan = require('morgan')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = process.env.PORT

let lastTodo = null

app.use(morgan('dev'))

/* On utilise les sessions */
app.use(session({ secret: 'PJlbnH8W1Orgo1DHv0i8tZxxRMFJacXr' }))

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next) {
    if (typeof(req.session.todos) === 'undefined') {
        req.session.todos = []
    }
    next()
})

/* On affiche la todolist et le formulaire */
.get('/', function(req, res) {
    res.render('todo.ejs', {
        protocole: 'http',
        host: '127.0.0.1',
        port: port
    })
})

/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, (req, res) => {
    if (req.body.newtodo !== '') {
        req.session.todos.push(req.body.newtodo)
    }
    res.redirect('/todo')
})

/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', (req, res) => {
    if (req.params.id !== '') {
        req.session.todos.splice(req.params.id, 1)
    }
    res.redirect('/todo')
})

// Chargement de socket.io

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', (socket) => {
    if (lastTodo !== null) {
        console.log({
            lastTodo: {
                content: lastTodo.text,
                id: lastTodo.id
            }
        })
    }

    socket.emit('new-client', lastTodo)

    socket.on('new-todo', (todo) => {
        var id = uuid()
        todo = ent.encode(todo)
        lastTodo = {
            text: todo,
            id: id
        }
        console.log({
            lastTodo: {
                text: lastTodo.text,
                id: lastTodo.id
            }
        })
        io.emit('new-added-todo', lastTodo)
    })

    socket.on('delete-todo', (id) => {
        console.log('delete : ', { id: id })
        io.emit('deleted-todo', id)
    })
})

server.listen(port, () => {
    console.log(`Application started : http://localhost:${port}/`)
})