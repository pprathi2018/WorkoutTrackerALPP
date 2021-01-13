const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start: String,
    current: String,
    goal: String,
    type: String
});

const exerciseSchema = new Schema({
    name: String,
    type: String,
    sets: Number,
    reps: Number,
    weight: Number,
})

// const routineSchema = new Schema({
//     name: String,
//     exercises: [{exerciseSchema, 
//         reps: Number, 
//         sets: Number,
//         weight: Number
//         }]
// });

const workoutSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    duration: Number,
    weightLifted: Number,
    date: String,
    exercises: [exerciseSchema]
    // baseRoutine: [routineSchema]
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
    // routines: [routineSchema],
    exercises: [exerciseSchema]
    
});

module.exports = {
    userSchema: mongoose.model('user', userSchema, 'users'),
    goalSchema: mongoose.model('goal', goalSchema, 'goals'),
    exerciseSchema: mongoose.model('exercise', exerciseSchema, 'exercises'),
    workoutSchema: mongoose.model('workout', workoutSchema, 'workouts')
};

// module.exports = mongoose.model('user', userSchema, 'users');