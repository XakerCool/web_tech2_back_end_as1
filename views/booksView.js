const booksController = require("../controllers/booksController.js")
const validation = require("../middleware/validation.js");

exports.showAllBooks = (req, res) => {
    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const books = booksController.getAllBooks()
    let data = []
    if (!(pageNumber * pageSize > books.length) || books.length < 10 || ((pageNumber * pageSize) - books.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (books[i] != null)
                data.push(books[i])
        }
    }
    else {
        return res.status(201).json(
            {
                status: "failed",
                data: {
                    message: "Limit reached"
                }
            }
        )
    }
    res.status(200).json({
        status: "success",
        pageNumber,
        pageSize,
        data: {
            books: data
        }
    })
}

const findBooks = (title, price) => {
    const books = booksController.getAllBooks()

    let foundedBooks = []
    books.forEach(item => {
        if (item != null && (item.title.toLowerCase() === title || item.price === price))
            foundedBooks.push(item)
    })

    return foundedBooks
}

exports.showConcreteBook = (req, res) => {
    let title = req.params.title || ""
    let price = parseInt(req.params.price) || null

    if (title === "" && price == null) {
        return res.status(400).json({
            status: "Error",
            data: {
                message: `Please enter filters: name or price`
            }
        })
    }

    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const foundedBooks = findBooks(title.toLowerCase(), price)

    let data = []

    if (!(pageNumber * pageSize > foundedBooks.length) || foundedBooks.length < 10 || ((pageNumber * pageSize) - foundedBooks.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (foundedBooks[i] != null)
                data.push(foundedBooks[i])
        }
    }
    res.status(200).json({
        status: "success",
        pageNumber,
        pageSize,
        data: {
            books: data
        }
    })
}

exports.addNewBook = (req, res) => {
    const newBook = Object.assign(req.body)
    if (!validation.bookValidation(newBook.title, newBook.author, parseInt(newBook.publishYear), parseInt(newBook.pageCount), parseInt(newBook.price)))
    {
        console.log(parseInt(newBook.publishYear), parseInt(newBook.pageCount), parseInt(newBook.price))
        return res.status(400).json({
            status: "Error",
            message: "Validation mistakes!",
            validation_data: {
                title: validation.lengthValidation(newBook.title),
                author: validation.lengthValidation(newBook.author),
                year: validation.yearValidation(parseInt(newBook.publishYear)),
                pageCount: validation.pagesValidation(parseInt(newBook.pageCount)),
                price: validation.priceValidation(parseInt(newBook.price))
            }
        })
    }
    booksController.getAllBooks().forEach(item => {
        if (newBook.title === item.title && newBook.author === item.author && newBook.publishYear === item.publishYear) {
            return res.status(400).json({
                status: "Error",
                message: "This book is currently existing!"
            })
        }
    })
    if (booksController.addNewBook(newBook.title, newBook.author, newBook.publishYear, newBook.pageCount, newBook.price)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(201).json({
        status: "success",
        message: "New book was added to the system"
    })
}

exports.updateBook = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such author. Wrong id"
        })
    }
    const newBook = Object.assign(req.body)
    if (!validation.bookValidation(newBook.title, newBook.author, parseInt(newBook.publishYear), parseInt(newBook.pageCount), parseInt(newBook.price)))
    {
        console.log(parseInt(newBook.publishYear), parseInt(newBook.pageCount), parseInt(newBook.price))
        return res.status(400).json({
            status: "Error",
            message: "Validation mistakes!",
            validation_data: {
                title: validation.lengthValidation(newBook.title),
                author: validation.lengthValidation(newBook.author),
                year: validation.yearValidation(parseInt(newBook.publishYear)),
                pageCount: validation.pagesValidation(parseInt(newBook.pageCount)),
                price: validation.priceValidation(parseInt(newBook.price))
            }
        })
    }
    if (booksController.updateBook(id, newBook.title, newBook.author, newBook.publishYear, newBook.pageCount, newBook.price)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(200).json({
        status: "Success",
        message: `Book with ${id} was updated`
    })
}

exports.deleteBook = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such genre. Wrong id"
        })
    }
    if (booksController.deleteBook(id)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(200).json({
        status: "Success",
        message: `Author with ${id} was deleted`
    })
}