const mongoose = require('mongoose');
const middleware = require('../common/middleware');

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

module.exports = (app) => {

    app.post('/api/match/webhooks', middleware.ensureAuthenticated, async (req, res) => {
        // let currentUser = await middleware.getUser( req.session.passport.user );

        console.log(req.body);
        res.send({});
    });

}