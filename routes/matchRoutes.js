const mongoose = require('mongoose');
const middleware = require('../common/middleware');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const matchStatus = require('../config/matchStatus');
const errors = require('../config/errors');

module.exports = (app) => {

    app.post('/api/match/webhooks', middleware.ensureAuthenticated, async (req, res) => {
        console.log(req.body);
        res.send({});
    });


    app.put('/api/match/accept', middleware.ensureAuthenticated, middleware.getUser, async(req, res) => {
        let findMatch = await Match.findOne({
            _id: new ObjectId(req.body.matchId)
        });

        if (findMatch) {
            findMatch.status = matchStatus.ACCEPTED;
            findMatch.lastStatusDate = Date.now();

            const matchUpdated = await findMatch.save();
            
            res.json({
                match: matchUpdated
            });
        } else {
            // Still not found - bizzare. should not happen.
            console.log(`Super horrible error on /api/match/accept with matchId ${req.body.matchId}`);
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.put('/api/match/propose', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        
        let findMatch = await Match.findOne({
          "firstUser.userID": req.body.firstUserId,
          "secondUser.userID": req.body.secondUserId,
          "firstUser.bookID": req.body.firstBookId,
          "secondUser.bookID": req.body.secondBookId
        });

        if (!findMatch) {
            findMatch = await Match.findOne({
                "firstUser.userID": req.body.secondUserId,
                "secondUser.userID": req.body.firstUserId,
                "firstUser.bookID": req.body.secondBookId,
                "secondUser.bookID": req.body.firstBookId
              });
        }

        if (findMatch) {

            findMatch.status = matchStatus.PROPOSED;
            findMatch.lastStatusDate = Date.now();
            findMatch.firstUser.proposed = true;

            const matchUpdated = await findMatch.save();
                        // Found wanted match
            res.json({
                match: matchUpdated
            });

        } else {
            // Still not found - bizzare. should not happen.
            console.log(`Super horrible error on /api/match/propose with users ${req.body.firstUserId} and ${req.body.secondUserId}`);

            res.status(500).json(
                {
                    error: errors.MATCH_NOT_FOUND
                }
            );
        }
    });

}