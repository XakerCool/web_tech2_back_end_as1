const reader = require("xlsx")
const file = reader.readFile("./fake_library_data.xlsx")
const Genre = require("../models/genreModel.js");

let genres = []
exports.fillGenresList = () => {
    try {
        let i = 1
        reader.utils.sheet_to_json(file.Sheets["Fake-Genres"]).forEach((item) => {
            let genre = new Genre()
            genre.setGenre(i, item.name)
            genres.push(genre.getGenre())
            i++
        })
        console.log("Genres list has been filled")
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }

}
exports.getAllGenres = function() {
    return genres
}

exports.addNewGenre = function (name) {
    let genre = new Genre(genres[genres.length - 1].id + 1, name)
    genres.push(genre.getGenre())
    try {
        let temp = []
        genres.forEach(item => {
            temp.push({name: item.name})
        })
        file.Sheets["Fake-Genres"] = reader.utils.json_to_sheet(temp)

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.updateGenre = (id, name) => {
    try {
        const sheet = file.Sheets["Fake-Genres"]
        let cellId = id + 1
        genres[id - 1].name = name
        sheet[`A${cellId}`].v = name

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}

exports.deleteGenre = (id) => {
    try {
        const sheet = file.Sheets["Fake-Genres"]
        let rowId = id + 1
        genres.splice(id - 1, 1)
        const range = reader.utils.decode_range(sheet['!ref']);
        const maxRows = range.e.r;

        for (let row = rowId; row <= maxRows; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const currentCell = reader.utils.encode_cell({ r: row, c: col });
                const upperCell = reader.utils.encode_cell({ r: row - 1, c: col });
                sheet[upperCell] = sheet[currentCell];
                delete sheet[currentCell];
            }
        }
        range.e.r--;
        sheet['!ref'] = reader.utils.encode_range(range);

        reader.writeFile(file, "./fake_library_data.xlsx", { bookType: "xlsx" })

    } catch (e) {
        console.log(e.message)
        return true
    }
    return false
}