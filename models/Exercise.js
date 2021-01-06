const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exerciseSchema = new Schema({
    name: String,
    weight: Number
});

module.exports = mongoose.model('exercise', exerciseSchema, 'exercises')