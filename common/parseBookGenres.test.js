const parseBookGenres = require('./parseBookGenres');

const genre1 = 'adventure';
const genre2 = 'fantasy';

const shelvesMock = {
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
