const parseAuthorName = require('./parseAuthorName');

let authorName = 'Tolkien';

let bookMock = {
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

