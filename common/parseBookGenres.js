const genreList = require('./genres');

function parseBookGenres (shelves) {
    let genres = [];

    // console.log(shelves.shelf);
    if (!shelves || !shelves.shelf) {
        return genres;
    }

    for (let s = 0; s < shelves.shelf.length; s++) {
      let genre = shelves.shelf[s].name.toLowerCase();

      if (genreList.list.find( g => g === genre ) && shelves.shelf[s].count >= 100 ) {
        genres.push(genre);
      }
    };

    return genres;
};

module.exports = parseBookGenres;