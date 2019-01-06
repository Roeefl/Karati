const mongoose = require('mongoose');
const middleware = require('../common/middleware');

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

module.exports = (app) => {

    app.post('/api/match/webhooks', middleware.ensureAuthenticated, async (req, res) => {
        console.log(req.body);
        res.send({});
    });

}