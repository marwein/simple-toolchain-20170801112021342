/* jshint node: true */
"use strict"
const dotenv = require('dotenv')
dotenv.load()

const express = require('express')
const ent = require('ent')
const uuid = require('uuid/v4')
const morgan = require('morgan')
const session = require('cookie-session')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = process.env.PORT

let lastTodo = null

//Initialisation de la liste todo du serveur
session.todos = []

// Logs en dans la console du serveur
app.use(morgan('combined'))

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


io.sockets.on('connection', (socket) => {
    socket.emit('new-client', lastTodo)

    socket.on('new-client', (todo) => {
        session.todos = [todo]
    })

    socket.on('new-todo', (todo) => {
        var id = uuid()
        todo = ent.encode(todo)
        lastTodo = {
            text: todo,
            id: id
        }
        session.todos.push(lastTodo)
        io.emit('new-added-todo', lastTodo)
    })

    socket.on('delete-todo', (id) => {
        var i = session.todos.length
        while (i--) {
            if (session.todos[i] &&
                session.todos[i].hasOwnProperty('id') &&
                (arguments.length > 2 && session.todos[i].id === id)
            ) {
                session.todos.splice(i, 1)
            }
        }
        io.emit('deleted-todo', id)
    })

    socket.on('empty-todos', () => {
        session.todos = []
    })
})

server.listen(port, () => {
    console.log(`Application started : http://localhost:${port}/`)
})