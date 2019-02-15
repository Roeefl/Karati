import {
    UPDATE_SEARCH_RESULTS,
    UPDATE_AVAILABLE_SWIPES,
    RETRIEVE_BOOK_FROM_GOODREADS,
    SELECT_BOOK_FROM_DB,
    BOOK_SELECTED
} from '../actions/types';

export const booksReducer = (books = false, action) => {
    if (action.type === UPDATE_AVAILABLE_SWIPES) {
        return action.payload || [];
    }

    return books;
};

export const bookSearchReducer = (searchResults = false, action) => {
    if (action.type === UPDATE_SEARCH_RESULTS) {
        return action.payload;
    }

    return searchResults;
};

export const retrieveBookFromGoodreadsReducer = (book = false, action) => {
    if (action.type === RETRIEVE_BOOK_FROM_GOODREADS) {
        return action.payload;
    }

    return book;
};

export const selectedBookFromBrowseReducer = (selectedBook = null, action) => {
    if (action.type === BOOK_SELECTED) {
        return action.payload;
    }

    return selectedBook;
};

export const selectBookFromMongoReducer = (book = false, action) => {
    if (action.type === SELECT_BOOK_FROM_DB) {
        return action.payload;
    }

    return book;
};
