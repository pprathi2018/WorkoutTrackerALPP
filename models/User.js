const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start: String,
    goal: String
});

const exerciseSchema = new Schema({
    name: String,
    type: String
})

const routineSchema = new Schema({
    name: String,
    exercises: [{exerciseSchema, 
        reps: Number, 
        sets: Number
        }]
});

const workoutSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    duration: Number,
    weightLifted: Number,
    date: Date,
    baseRoutine: [routineSchema]
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    goals: [goalSchema],
    workouts: [workoutSchema],
    routines: [routineSchema],
    customExercises: {
        type: Map,
        of: Number
    }
});

module.exports = {
    userSchema: mongoose.model('user', userSchema, 'users'),
    goalSchema: mongoose.model('goal', goalSchema, 'goals')
};

// module.exports = mongoose.model('user', userSchema, 'users');