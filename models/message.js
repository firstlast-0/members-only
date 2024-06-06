const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MsgSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, required: true },
    date: { type: String, required: true },
    by: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('Message', MsgSchema);
