// models/User.js
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
{
username: { type: String, unique: true, required: true, trim: true },
password: { type: String, required: true }, // Caesar-encrypted value
roles: {
type: [String],
default: ['User'],
enum: ['User', 'Student', 'Moderator', 'SSG', 'Registrar', 'Admin', 'Super Admin']
},
meta: { type: mongoose.Schema.Types.Mixed }
},
{ timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
