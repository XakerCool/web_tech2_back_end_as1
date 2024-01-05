const express = require("express")
const body_parser = require("body-parser")


const app = express()
const PORT = 3000


const booksView = require("./views/booksView.js")
const booksController = require("./controllers/booksController.js")

const authorsView = require("./views/authorsView.js")
const authorsController = require("./controllers/authorsController.js")

const genresView = require("./views/genreView.js")
const genresController = require("./controllers/genresController.js")


app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT)
    booksController.fillBooksList()
    authorsController.fillAuthorsList()
    genresController.fillGenresList()
})

//Get all data
app.get("/books", booksView.showAllBooks)
app.get("/authors", authorsView.showAllAuthors)
app.get("/genres", genresView.showAllGenres)

//Get filtered data
app.get("/books/:title", booksView.showConcreteBook)
app.get("/authors/:fullName", authorsView.showConcreteAuthor)
app.get("/genres/:name", genresView.showConcreteGenre)

//Add data
app.post("/books/add", booksView.addNewBook)
app.post("/genres/add", genresView.addNewGenre)
app.post("/authors/add", authorsView.addNewAuthor)

//Update data

app.put("/books/:id/update", booksView.updateBook)
app.put("/authors/:id/update", authorsView.updateAuthor)
app.put("/genres/:id/update", genresView.updateGenre)

//Delete data
app.delete("/books/:id/delete", booksView.deleteBook)
app.delete("/authors/:id/delete", authorsView.deleteAuthor)
app.delete("/genres/:id/delete", genresView.deleteGenre)