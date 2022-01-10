const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({

	emp_id: {type: String, unique : true, required: true}, //username
    password: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true}, //reserved or general
});

module.exports = mongoose.model('User', userSchema);