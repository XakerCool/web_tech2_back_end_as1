class Genre {
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    setGenre(id, name) {
        this.id = id
        this.name = name
    }

    getGenre() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = Genre