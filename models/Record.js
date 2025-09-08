// models/Record.js
const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema(
{
class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
row: { type: Number, required: true },
data: { type: Object, required: true } // arbitrary key/value from sheet row
},
{ timestamps: true }
);


recordSchema.index({ class: 1, row: 1 }, { unique: true });


module.exports = mongoose.model('Record', recordSchema);
