const path = require('path')
const express = require('express')
const BooksService = require('./books-service')

const booksRouter = express.Router()
const jsonBodyParser = express.json()

booksRouter
.route('/')
.get((req, res, next) => {
    BooksService.getAllBooks(req.app.get('db'))
    .then(books => {
        res.json(BooksService.serializeBooks(books))

    })
    .catch(next)
})

module.exports = booksRouter