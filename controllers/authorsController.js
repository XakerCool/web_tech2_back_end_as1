const reader = require("xlsx")
const file = reader.readFile("./fake_library_data.xlsx")
const Author = require("../models/authorModel.js");

let authors = []
exports.fillAuthorsList = () => {
    try {
        let i = 1
        reader.utils.sheet_to_json(file.Sheets["Fake-Authors"]).forEach((item) => {
            let author = new Author()
            author.setAuthor(i, item.name, item.surname, item.birthday)
            authors.push(author.getAuthor())
            i++
        })
        console.log("Authors list has been filled")
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }

}
exports.getAllAuthors = function() {
    return authors
}

exports.addNewAuthor = function (name, surname, birthday) {
    let author = new Author(authors[authors.length - 1].id + 1, name, surname, birthday)
    authors.push(author.getAuthor())

    try {
        let temp = []
        authors.forEach(item => {
            temp.push({
                name: item.name,
                surname: item.surname,
                birthday: item.birthday
            })
        })
        file.Sheets["Fake-Authors"] = reader.utils.json_to_sheet(temp)

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.updateAuthor = (id, name, surname, birthday) => {
    try {
        const sheet = file.Sheets["Fake-Authors"]
        let cellId = id + 1
        sheet[`A${cellId}`].v = name
        sheet[`B${cellId}`].v = surname
        sheet[`C${cellId}`].v = birthday

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.deleteAuthor = (id) => {
    try {
        const sheet = file.Sheets["Fake-Authors"]
        let rowId = id + 1
        authors.splice(id - 1, 1)
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