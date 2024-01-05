
exports.lengthValidation = (string) => {
    return string.length > 2 && string.length < 30
}

exports.yearValidation = (year) => {
    return year > 1900 && year < 2024
}

exports.pagesValidation = (pages) => {
    return pages > 3 && pages < 1300
}

exports.priceValidation = (price) => {
    return price > 0.0 && price < 150000.0
}

exports.bookValidation = (name, author, year, pages, price) => {
    return this.lengthValidation(name) && this.lengthValidation(author) && this.yearValidation(year)
        && this.pagesValidation(pages) && this.priceValidation(price)
}