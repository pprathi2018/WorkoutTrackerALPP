console.log("May Node be with you");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connectionString = "mongodb+srv://pprathi2018:Pr01302k1@cluster0.meoms.mongodb.net/WorkoutTrackerDB?retryWrites=true&w=majority"

const mongoose = require('mongoose')
const port = process.env.port || 3000;
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
        genGoals = user.goals.filter(goal=>goal.type == "General");
        liftGoals = user.goals.filter(goal=>goal.type == "Lift");
        res.render('home', {user, genGoals, liftGoals, loginStatus: "Logout"});
    }
    else {
        res.redirect('/');
    }
})
    
app.get('/workouts', ensureAuthentication, async (req, res) => {
    var workouts = req.user.workouts;
    var exercises = req.user.exercises;
    // console.log(workouts);
    // console.log(exercises);
    res.render('workouts.ejs', 
    {
        workouts,
        exercises,
        loginStatus: "Logout"});
})

app.get('/analytics', ensureAuthentication, (req, res) => {
    genGoals = user.goals.filter(goal=>goal.type == "General");
    liftGoals = user.goals.filter(goal=>goal.type == "Lift");

    genGoalProgress = genGoals.map(goal=>getProgress(goal.start, goal.current, goal.goal));
    liftGoalProgress = liftGoals.map(goal=>getProgress(goal.start, goal.current, goal.goal));

    genGoalMap = new Map();
    liftGoalMap = new Map();

    genGoals.forEach((goal, i) => genGoalMap.set(goal, genGoalProgress[i]));
    liftGoals.forEach((goal, i) => liftGoalMap.set(goal, liftGoalProgress[i]));

    // console.log(liftGoalMap);
    // for (const [goal, progress] of genGoalMap) {
    //     console.log(goal);
    // }
    // console.log(10/50);
        
    res.render('analytics.ejs', {genGoalMap, liftGoalMap, loginStatus: "Logout"});
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

app.post('/updateGoals', async (req, res) => {
    console.log(req.body);
    var i = 0;
    var startGoal;
    var curGoal;
    var desGoal;
    for (let g in req.body) {
        if (i == 0) {
            startGoal = req.body[g];
            i++;
        } else if (i == 1) {
            curGoal = req.body[g];
            i++;
        } else if (i == 2) {
            desGoal = req.body[g];
            i++;
        } else {
            if (curGoal === null || desGoal === null || startGoal === null ||
                curGoal == '' || desGoal == '' || startGoal == '') {
                i = 0;
                continue;
            }
            var newGoal = new goalSchema({
                name: g.substring(7),
                start: startGoal,
                current: curGoal,
                goal: desGoal,
                type: req.body[g]
            });

            console.log('createdGoal');
            console.log(startGoal);

            var foundCopy = false;

            const curUser = await userSchema.findOne({username: user.username})
            curUserGoals = curUser.goals;

            for (const [i, goal] of curUserGoals.entries()) {
                if (goal.name == g.substring(7)) {
                    curUserGoals[i] = newGoal;
                    const doc = await curUser.save()
                    foundCopy = true;
                    console.log('updatedGoal')
                    break;
                }
            }

            if (foundCopy) {
                founcCopy = false;
                i = 0;
                continue;
            }
            
            curUserGoals.push(newGoal);
            const doc = await curUser.save();
            i = 0;
            console.log("updated");
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
        console.log(e);
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
            "$push": {"workouts": newWorkout}
        },
        {
            new: true,
            upsert: true
        }
    ).catch(error => console.error(error))
    res.redirect('/home');
    // console.log(req.body);
})

getProgress = function(start, current, goal) {
    if (goal < start) {
        var totalDiff = start - goal;
        var curDiff = start - current;
        return ((curDiff/totalDiff) * 100).toFixed(4) + '%';
    } else {
        var totalDiff = goal - start;
        var curDiff = current - start;
        return ((curDiff/totalDiff) * 100).toFixed(4) + '%';
    }
}

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

app.delete('/deleteGoal', async (req, res) => {
    var curUser = await userSchema.findOne({username: user.username})
    var goals = curUser.goals;
    var toDelete = 0;
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].name == req.body.name) {
            toDelete = i;
            break;
        }
    }
    goals.splice(toDelete, 1);
    const doc = await curUser.save()

    // for (const [i, goal] of curUserGoals.entries()) {
    //     if (goal.name == g.substring(7)) {
    //         curUserGoals[i] = newGoal;
    //         const doc = await curUser.save()
    //         foundCopy = true;
    //         console.log('updatedGoal')
    //         break;
    //     }
    // }


    // res.render('analytics.ejs', {genGoalMap, liftGoalMap, loginStatus: "Logout"});
    // console.log(req.body.name);
    // userSchema.findOneAndUpdate( 
    //     {username: user.username},
    //     { $pull: {goals: {$elemMatch:{ name: [req.body.name] }}}}
    // ).then(result => {
    //     console.log(result);
    // })
    // toDelete = user.goals.filter(goal=>goal.name == req.body.name);
    // console.log(toDelete);
    // user.goals.remove(toDelete);
    return res.json("Success");
})

app.listen(port, function () {
    console.log('listening on 3000');
})

