const mongoose = require('mongoose');

const scriptSchema = mongoose.Schema({
	sentence: { type: String, required: true},
	sentence_char: { type: String, required: true},
	paragraph: { type: String, required: true},
	paragraph_char: { type: String, required: true},

});

module.exports = mongoose.model('Script', scriptSchema);