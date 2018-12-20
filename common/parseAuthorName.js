const errors = require('../config/errors');

function parseAuthorName (book) {
  if (!book) {
    return errors.NO_AUTHOR;
  };

  if (!book.authors) {
    return errors.NO_AUTHOR;
  };

  if (!book.authors.author) {
    if (!book.authors.name) {
      return errors.NO_AUTHOR;
    };

    return book.authors.name;
  };

  if (!Array.isArray(book.authors.author)) {
    if (!book.authors.author.name) {
      return errors.NO_AUTHOR;
    }
    
    return book.authors.author.name;
  };

  // It's an array
  return book.authors.author[0].name;
};

module.exports = parseAuthorName;