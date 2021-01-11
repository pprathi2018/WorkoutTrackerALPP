console.log("May Node be with you");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connectionString = "mongodb+srv://andrewlin573:Alin4523$$@cluster0.bv2vu.mongodb.net/andrewlin573?retryWrites=true&w=majority"

const mongoose = require('mongoose')
const port = 3000;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require("./utils/passport")(passport)


// ------ Models ------ //
// const ExerciseModel = require('./models/Exercise.js')
const { goalSchema } = require('./models/User.js');
const { userSchema } = require('./models/User.js');
const { exerciseSchema } = require('./models/User.js');
const { workoutSchema } = require('./models/User.js');

mongoose.connect(connectionString, {useUnifiedTopology: true, useNewUrlParser:true})
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log(err));

var connection = mongoose.connection;
var user;

app.set('view engine', 'ejs');
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
next();
})

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const {ensureAuthentication} = require("./utils/authentication");

// ----- ROUTING ----- //

app.get("/", (req, res) => {
    res.render('index.ejs', {
            loginStatus: "Login / Sign-Up"
    });
})

app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        user = req.user;
        res.render('home', {user, loginStatus: "Logout"});
    }
    else {
        res.redirect('/');
    }
})
    
app.get('/workouts', ensureAuthentication, async (req, res) => {
    var workouts = user.workouts;
    // var exercises = workouts.exercises;
    // console.log(workouts);
    // console.log(exercises);
    res.render('workouts.ejs', 
    {
        workouts,
        loginStatus: "Logout"});
})

app.get('/analytics', ensureAuthentication, (req, res) => {
    res.render('analytics.ejs', {loginStatus: "Logout"});
})

app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('logout.ejs', {loginStatus: "Logout"});
    }
    else {
        res.render('user.ejs', {loginStatus: "Login / Sign-Up"});
    }
})

const User = require('./models/User.js');

require('./usersRoute')(app)

// ----- Update Goals ----- //

app.post('/updateGoals', (req, res) => {
    var i = 0;
    var temp;
    for (let g in req.body) {
        if (i == 0) {
            temp = req.body[g];
            i++;
        } else {
            var newGoal = new goalSchema({
                name: g.substring(7),
                start: temp,
                goal: req.body[g]
            });
            userSchema.findOneAndUpdate(
                { username: user.username },
                {
                    "$push": {"goals": newGoal} 
                },
                {
                    new: true,
                    upsert: true
                }
            ).catch(error => console.error(error))

            newGoal.save((err, data) => {
                if (err) {
                    console.log(err);
                }
            });
            i--;
        }
    }
    res.redirect('/home');
})

// ----- Save Workout ----- //
app.post('/finishWorkout', (req, res) => {
    var workout = req.body;
    const wName = workout.workoutName;
    delete workout.workoutName;
    const dur = workout.duration;
    delete workout.duration;
    var i = 0;

    var numSets;
    var numReps;
    var exerciseName;
    var exercises = [];
    var totalWeightLifted = 0;

    for (let e in workout) {
        if (i == 0) {
            numSets = workout[e];
            exerciseName = e.substring(4);
            i++;
        } else if (i == 1) {
            numReps = workout[e];
            i++;
        } else if (i == 2) {
            var exercise = new exerciseSchema({
                name: exerciseName,
                sets: numSets,
                reps: numReps,
                weight: workout[e]
            });
            exercises.push(exercise);
            totalWeightLifted += numSets * numReps * workout[e];
            i = 0;
        }
    }
    var d = new Date();
    var newWorkout = new workoutSchema({
        name: wName,
        duration: dur,
        weightLifted: totalWeightLifted,
        date: d.toDateString(),
        exercises: exercises
    })

    userSchema.findOneAndUpdate(
        { username: user.username },
        {
            "$push": {"workouts": newWorkout, "$position": 0}
        },
        {
            new: true,
            upsert: true
        }
    ).catch(error => console.error(error))
    res.redirect('/home');
    // console.log(req.body);
})

/**
app.post('/exercises', (req, res) => {
    exercisesCollection.insertOne(req.body).then(result => {
        res.redirect('/');
    }).catch(error => console.error(error))
})
*/

// app.post('/exercises', (req, res) => {
//     var newExercise = new ExerciseModel();
//     newExercise.name = req.body.name;
//     newExercise.weight = req.body.weight;
//     newExercise.save((err, data) => {
//         if (err) {
//             console.log(error);
//         }
//         else {
//             res.redirect('/');
//         }
//     })

// })

// app.put('/exercises', (req, res) => {
//     ExerciseModel.findOneAndUpdate(
//         { name: 'Dumbell Press' },
//         {
//             name: req.body.name,
//             weight: req.body.weight
//         },
//         {
//             new: true,
//             upsert: true
//         }
//     ).then(result => {
//         res.json('Success');
//     }).catch(error => console.error(error))
// })

// app.delete('/exercises', async (req, res) => {
//     ExerciseModel.deleteOne(
//         { name: req.body.name },
//     ).then(result => {
//         if (result.deletedCount === 0) {
//             return res.json('No Barbell Exercise to delete');
//         }
//         res.json('Deleted a Barbell Exercise');
//     }).catch(error => console.error(error))
// })

app.listen(port, function () {
    console.log('listening on 3000');
})

