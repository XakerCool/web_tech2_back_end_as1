class BookModel {
    constructor(id = -1, title = "", author = "", publishYear = "", pageCount = -1, price = 0.0) {
        this.id = id
        this.title = title
        this.author = author
        this.publishYear = publishYear
        this.pageCount = pageCount
        this.price = price
    }

    // Getter and setter methods
    setBook(id, title, author, publishYear, pageCount, price) {
        this.id = id
        this.title = title
        this.author = author
        this.publishYear = publishYear
        this.pageCount = pageCount
        this.price = price
    }
    getBook() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            publishYear: this.publishYear,
            pageCount: this.pageCount,
            price: this.price
        }
    }
}

module.exports = BookModel