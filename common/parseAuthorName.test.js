const parseAuthorName = require('./parseAuthorName');

const authorName = 'Tolkien';

const bookMock = {
    authors: {
        author: [
            {
                _id: Date.now(),
                name: authorName
            }
        ]
    }
}

test('Parse author name from book object', () => {
  expect(
      parseAuthorName(bookMock)
    ).toEqual(authorName);
});
