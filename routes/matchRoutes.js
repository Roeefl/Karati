const mongoose = require('mongoose');
const middleware = require('../common/middleware');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const matchStatus = require('../config/matchStatus');
const errors = require('../config/errors');

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '698267',
  key: '300a43dcc40b1a52fa00',
  secret: 'e433a406238958f921c2',
  cluster: 'eu',
  forceTLS: true
});

module.exports = (app) => {

    app.post('/api/match/webhooks', middleware.ensureAuthenticated, async (req, res) => {
        console.log(req.body);
        res.send({});
    });

    app.get('/api/match/chat/:matchId', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        const { matchId } = req.params;

        console.log(req.params);

        let findMatch = await Match.findOne({
            _id: new ObjectId(matchId)
        });

        // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // const formatDate = props.whenSent.toLocaleDateString("en-US", options);

        if (findMatch) {           
            res.json({
                chat: findMatch.chat
            });
        } else {
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.post('/api/match/chat', middleware.ensureAuthenticated, middleware.getUser, async(req, res) => {
        const { matchId, senderId, message } = req.body;

        let findMatch = await Match.findOne({
            _id: new ObjectId(matchId)
        });

        if (findMatch) {
            const pushChatMsg = {
                sender: senderId,
                message: message,
                whenSent: Date.now()
            };

            findMatch.chat.push(pushChatMsg);

            const matchUpdated = await findMatch.save();

            // console.log(`channel name: ${matchId}`);
            pusher.trigger(`${matchId}`, 'newChatMessage', {
                msg: message
            });
            
            res.json({
                match: matchUpdated
            });
        } else {
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.put('/api/match/accept', middleware.ensureAuthenticated, middleware.getUser, async(req, res) => {
        const { matchId } = req.body;

        let findMatch = await Match.findOne({
            _id: new ObjectId(matchId)
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
            console.log(`Super horrible error on /api/match/accept with matchId ${matchId}`);
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.put('/api/match/propose', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        const { firstUserId, secondUserId, firstBookId, secondBookId } = req.body;
        
        let findMatch = await Match.findOne({
          "firstUser.userID": firstUserId,
          "secondUser.userID": secondUserId,
          "firstUser.bookID": firstBookId,
          "secondUser.bookID": secondBookId
        });

        if (!findMatch) {
            findMatch = await Match.findOne({
                "firstUser.userID": secondUserId,
                "secondUser.userID": firstUserId,
                "firstUser.bookID": secondBookId,
                "secondUser.bookID": firstBookId
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
            console.log(`Super horrible error on /api/match/propose with users ${firstUserId} and ${secondUserId}`);

            res.status(500).json(
                {
                    error: errors.MATCH_NOT_FOUND
                }
            );
        }
    });

}