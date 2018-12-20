const GENRES = [
    'adventure', 'action', 'fantasy', 'fiction', 'classics', 'science', 'psychology', 'nonfiction',
    'mystery', 'thriller', 'romance', 'biography', 'history', 'contemporary', 'horror'
];

function parseBookGenres (shelves) {
    let genres = [];

    // console.log(shelves.shelf);
    if (!shelves || !shelves.shelf) {
        return genres;
    }

    for (let s = 0; s < shelves.shelf.length; s++) {
      let genre = shelves.shelf[s].name.toLowerCase();

      if (GENRES.find( g => g === genre ) && shelves.shelf[s].count >= 100 ) {
        genres.push(genre);
      }
    };

    return genres;
};

module.exports = parseBookGenres;