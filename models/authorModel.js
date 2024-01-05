class AuthorModel {
    constructor(id, name, surname, birthday) {
        this.id = id
        this.name = name
        this.surname = surname
        this.birthday = birthday
    }

    setAuthor(id, name, surname, birthday) {
        this.id = id
        this.name = name
        this.surname = surname
        this.birthday = birthday
    }

    getAuthor() {
        return {
            id: this.id,
            name: this.name,
            surname: this.surname,
            birthday: this.birthday
        }
    }
}

module.exports = AuthorModel