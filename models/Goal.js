const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start: Number,
    goal: Number
});

export const goalSchema = mongoose.model('goal', goalSchema, 'goals');