const reader = require("xlsx")
const file = reader.readFile("./fake_library_data.xlsx")
const Book = require("../models/bookModel.js");


let books = []
exports.fillBooksList = () => {
    try {
        let i = 1
        reader.utils.sheet_to_json(file.Sheets["Fake-Books"]).forEach((item) => {
            let book = new Book()
            book.setBook(i, item.title, item.author, item.publishYear, item.pageCount, item.price)
            books.push(book.getBook())
            i++
        })
        console.log("Books list has been filled")
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }

}
exports.getAllBooks = function() {
    return books
}

exports.addNewBook = function (title, author, publishYear, pageCount, price) {
    let book = new Book(books[books.length - 1].id + 1, title, author, publishYear, pageCount, price)
    books.push(book.getBook())

    try {
        let temp = []
        books.forEach(item => {
            temp.push({
                title: item.title,
                author: item.author,
                publishYear: item.publishYear,
                pageCount: item.pageCount,
                price: item.price
            })
        })
        file.Sheets["Fake-Books"] = reader.utils.json_to_sheet(temp)

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.updateBook = (id, title, author, publishYear, pageCount, price) => {
    try {
        const sheet = file.Sheets["Fake-Books"]
        let cellId = id + 1
        sheet[`A${cellId}`].v = title
        sheet[`B${cellId}`].v = author
        sheet[`C${cellId}`].v = publishYear
        sheet[`D${cellId}`].v = pageCount
        sheet[`E${cellId}`].v = price

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.deleteBook = (id) => {
    try {
        const sheet = file.Sheets["Fake-Books"]
        let rowId = id + 1
        books.splice(id - 1, 1)
        const range = reader.utils.decode_range(sheet['!ref'])
        const maxRows = range.e.r

        for (let row = rowId; row <= maxRows; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const currentCell = reader.utils.encode_cell({ r: row, c: col })
                const upperCell = reader.utils.encode_cell({ r: row - 1, c: col })
                sheet[upperCell] = sheet[currentCell]
                delete sheet[currentCell]
            }
        }
        range.e.r--;
        sheet['!ref'] = reader.utils.encode_range(range)

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}