const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notification = new Schema({
  notifType: {
    type: String,
    required: false,
    default: "New Match"
  },
  content: {
    type: String,
    required: true,
    default: "New Notification"
  },
  dateCreated: {
    type: Date,
    required: true
  },
  seen: {
    type: Boolean,
    required: false,
    default: false
  },
  link: {
    type: String,
    required: false,
    default: ""
  }
});

module.exports = notification;
