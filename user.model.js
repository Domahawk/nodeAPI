const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String, 
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)