const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first: { type: String, required: true, maxLength: 100 },
    last: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String },
    Admin: { type: String }
});

UserSchema.virtual('fullname').get(function () {
    return `${this.first} ${this.last}`;
});

module.exports = mongoose.model('User', UserSchema);
