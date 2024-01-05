const authorsController = require("../controllers/authorsController.js")

exports.showAllAuthors = (req, res) => {
    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const authors = authorsController.getAllAuthors()
    let data = []
    if (!(pageNumber * pageSize > authors.length) || authors.length < 10 || ((pageNumber * pageSize) - authors.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (authors[i] != null)
                data.push(authors[i])
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
            authors: data
        }
    })
}

const findAuthors = (name, surname) => {
    const authors = authorsController.getAllAuthors()

    let foundedAuthors = []

    authors.forEach(item => {
        if (item != null && (item.name.toLowerCase() === name || item.surname.toLowerCase() === surname))
            foundedAuthors.push(item)
    })

    return foundedAuthors
}

exports.showConcreteAuthor = (req, res) => {
    let name = req.params.fullName.split(" ")[0] || ""
    let surname = req.params.fullName.split(" ")[1] || ""

    if (name === "" && surname === "") {
        return res.status(400).json({
            status: "Error",
            data: {
                message: `Please enter filters: name or surname`
            }
        })
    }
    const pageSize = req.query.pageSize
    const pageNumber = req.query.pageNumber
    const foundedAuthors = findAuthors(name.toLowerCase(), surname.toLowerCase())

    let data = []

    if (!(pageNumber * pageSize > foundedAuthors.length) || foundedAuthors.length < 10 || ((pageNumber * pageSize) - foundedAuthors.length) <= 10) {
        for (let i = (pageSize * pageNumber) - pageSize; i < (pageSize * pageNumber); i++) {
            if (foundedAuthors[i] != null)
                data.push(foundedAuthors[i])
        }
    }
    res.status(200).json({
        status: "success",
        pageNumber,
        pageSize,
        data: {
            authors: data
        }
    })
}

exports.addNewAuthor = (req, res) => {
    const newAuthor = Object.assign(req.body)
    authorsController.getAllAuthors().forEach(item => {
        if (newAuthor.name === item.name || newAuthor.surname === item.surname) {
            return res.status(400).json({
                status: "Error",
                message: "This author is currently existing!"
            })
        }
    })
    if (authorsController.addNewAuthor(newAuthor.name, newAuthor.surname, newAuthor.birthday)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(201).json({
        status: "success",
        message: "New author was added to the system"
    })
}

exports.updateAuthor = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such author. Wrong id"
        })
    }
    let author = {
        name: req.body.name,
        surname: req.body.surname,
        birthday: req.body.birthday
    }
    if (authorsController.updateAuthor(id, author.name, author.surname, author.birthday)) {
        return res.status(500).json({
            status: "Exception",
            message: "Something went wrong"
        })
    }
    res.status(200).json({
        status: "Success",
        message: `Author with ${id} was updated`
    })
}

exports.deleteAuthor = (req, res) => {
    let id = parseInt(req.params.id) || null
    if (id == null) {
        return res.status(404).json({
            status: "Error",
            message: "No such genre. Wrong id"
        })
    }
    if (authorsController.deleteAuthor(id)) {
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