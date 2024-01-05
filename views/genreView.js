const genresController = require("../controllers/genresController.js")
const bodyParser = require("body-parser");

exports.showAllGenres = (req, res) => {
    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const genres = genresController.getAllGenres()
    let data = []
    if (!(pageNumber * pageSize > genres.length) || genres.length < 10 || ((pageNumber * pageSize) - genres.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (genres[i] != null)
                data.push(genres[i])
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
            genres: data
        }
    })
}

exports.showConcreteGenre = (req, res) => {
    let name = req.params.name || ""

    if (name === "") {
        return res.status(400).json({
            status: "Error",
            data: {
                message: `Please enter filters: name`
            }
        })
    }

    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const genres = genresController.getAllGenres()

    let data = []

    if (!(pageNumber * pageSize > genres.length) || genres.length < 10 || ((pageNumber * pageSize) - genres.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (genres[i] != null && genres[i].name.toLowerCase() === name.toLowerCase())
                data.push(genres[i])
        }
    }
    res.status(200).json({
        status: "success",
        pageNumber,
        pageSize,
        data: {
            genres: data
        }
    })
}

exports.addNewGenre = (req, res) => {
    const newGenre = Object.assign(req.body)
    genresController.getAllGenres().forEach(item => {
        if (newGenre.name === item.name) {
            return res.status(400).json({
                status: "Error",
                message: "This genre is currently existing!"
            })
        }
    })
    if (genresController.addNewGenre(newGenre.name)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(201).json({
        status: "success",
        message: "New genre was added to the system"
    })
}

exports.updateGenre = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such genre. Wrong id"
        })
    }
    let genre = {
        name: req.body.name
    }
    if (genresController.updateGenre(id, genre.name)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(200).json({
        status: "Success",
        message: `Genre with ${id} was updated`
    })
}

exports.deleteGenre = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such genre. Wrong id"
        })
    }
    if (genresController.deleteGenre(id)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(200).json({
        status: "Success",
        message: `Genre with ${id} was deleted`
    })
}