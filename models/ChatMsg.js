const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const User = mongoose.model('users');

const chatMsg = new Schema (
    {
        sender: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        whenSent: {
            type: Date,
            required: true
        }
    }
);

chatMsg.virtual('senderName')
    .get(async function () {
        const findUser = await User.findById(this.sender);
        return findUser.username;
    });

module.exports = chatMsg;