const mongoose = require('mongoose');
const middleware = require('../common/middleware');

const Match = mongoose.model('matches');

const matchStatus = require('../config/matchStatus');
const errors = require('../config/errors');

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu',
  forceTLS: true
});

module.exports = (app) => {

    // app.post('/api/match/webhooks', middleware.ensureAuthenticated, async (req, res) => {
    //     res.send({});
    // });

    app.get('/api/proposal/:proposalId', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // const formatDate = props.whenSent.toLocaleDateString("en-US", options);

        const { proposalId } = req.params;
        const proposal = await Match.findById( proposalId );

        if (proposal) {
            const proposalData = await middleware.convertMatchToProposal(proposal, req.currentUser._id);
            res.json({ proposal: proposalData });
        } else {
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.post('/api/proposal/chat', middleware.ensureAuthenticated, middleware.getUser, async(req, res) => {
        const { matchId, senderId, message } = req.body;

        let proposal = await Match.findById( matchId );

        if (proposal) {
            const newChatMsg = {
                sender: senderId,
                message: message,
                whenSent: Date.now()
            };

            proposal.chat.push(newChatMsg);

            await proposal.save();

            console.log(`channel name: ${matchId}`);
            pusher.trigger(`${matchId}`, 'newChatMsg', { message });
            
            const proposalData = await middleware.convertMatchToProposal(proposal, req.currentUser._id);
            // console.log('proposalData:');
            // console.log(proposalData);
            
            res.json({ proposal: proposalData });
        } else {
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

    app.put('/api/match/accept', middleware.ensureAuthenticated, middleware.getUser, async(req, res) => {
        const { matchId } = req.body;

        let findMatch = await Match.findById(matchId);

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

        const findMatch = await Match.findMatchOfEitherUser({ firstUserId, secondUserId, firstBookId, secondBookId });

        if (findMatch) {
            findMatch.status = matchStatus.PROPOSED;
            findMatch.lastStatusDate = Date.now();
            findMatch.firstUser.proposed = true;

            const match = await findMatch.save();
            res.json({ match });
        } else {
            // Still not found - bizzare. should not happen.
            console.log(`Super horrible error on /api/match/propose with users ${firstUserId} and ${secondUserId}`);
            res.status(500).json({ error: errors.MATCH_NOT_FOUND });
        }
    });

}
