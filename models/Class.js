// models/Class.js
const mongoose = require('mongoose');


const classSchema = new mongoose.Schema(
{
name: { type: String, required: true }, // e.g., "Math 10 - Section A"
subjectCode: { type: String }, // optional code
description: { type: String },
sheetId: { type: String, required: true }, // Google Sheet ID
moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
{ timestamps: true }
);


module.exports = mongoose.model('Class', classSchema);
