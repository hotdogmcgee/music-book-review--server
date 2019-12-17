const xss = require('xss')
const Treeize = require('treeize')

const BooksService = {
    getAllBooks(db) {
        return db
        .from('books AS bk')
        .select(
            'bk.id',
            'bk.title',
            'bk.information',
            'bk.instrument',
            'bk.year_published',
            'bk.author_id',
            ...userFields,
            ...authorFields

        )
        .leftJoin(
            'authors AS auth',
            'bk.author_id',
            'auth.id'

        )
        // .leftJoin(
        //     'reviews AS rv',
        //     'rv.book_id',
        //     'bk.id'
        // )
        .leftJoin(
            'users AS usr',
            'bk.user_id',
            'usr.id'
        )
    },

    serializeBooks(books) {
        return books.map(this.serializeBook)
    },

    serializeBook(book) {
        const bookTree = new Treeize()

        const bookData  = bookTree.grow([ book ]).getData()[0]

        console.log(bookData);

        return {
            id: bookData.id,
            title: xss(bookData.title),
            information: xss(bookData.information),
            instrument: xss(bookData.instrument),
            year_published: bookData.year_published,
            author_id: bookData.author_id,
            user: bookData.user || {},
            author: bookData.author || {}
        }
    }
}

const userFields = [
    'usr.id AS user:id',
    'usr.user_name AS user:user_name',
    'usr.full_name AS user:full_name',
    'usr.email AS user:email',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
  ]

  const authorFields = [
      'auth.id AS author:id',
      'auth.first_name AS author:first_name',
      'auth.last_name AS author:last_name'
  ]

  module.exports = BooksService