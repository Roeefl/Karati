const parseBookGenres = require('./parseBookGenres');

let genre1 = 'adventure';
let genre2 = 'fantasy';

let shelvesMock = {
    shelf: [
        {
            name: genre1,
            count: 203
        },
        {
            name: genre2,
            count: 304
        }
    ]
}

test('Parse book genre from book.shelves object', () => {
  expect(
    parseBookGenres(shelvesMock)
  ).toContain(genre1);

  expect(
    parseBookGenres(shelvesMock)
  ).toContain(genre2);
});

