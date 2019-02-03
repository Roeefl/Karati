import React from 'react';
import ReactDOM from 'react-dom';
import Social from '../Social';

test('Shows the front page?', () => {
    const div = document.createElement('div');

    console.log(Social);

    ReactDOM.render(<Social />, div);

    console.log(div.innerHTML);

    ReactDOM.unmountComponentAtNode(div);
});

// it('Parse author name from book object', () => {
//     expect(
//         parseAuthorName(bookMock)
//     ).toEqual(authorName);
// });

// test('Parse book genre from book.shelves object', () => {
//     expect(
//         parseBookGenres(shelvesMock)
//     ).toContain(genre1);

//     expect(
//         parseBookGenres(shelvesMock)
//     ).toContain(genre2);
// });
