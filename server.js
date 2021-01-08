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
const ExerciseModel = require('./models/Exercise.js')

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
        res.render('home', {user: req.user, loginStatus: "Logout"});
    }
    else {
        res.redirect('/');
    }
})
    
app.get('/workouts', ensureAuthentication, (req, res) => {
    res.render('workouts.ejs', {loginStatus: "Logout"});
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

/**
app.post('/exercises', (req, res) => {
    exercisesCollection.insertOne(req.body).then(result => {
        res.redirect('/');
    }).catch(error => console.error(error))
})
*/

app.post('/exercises', (req, res) => {
    var newExercise = new ExerciseModel();
    newExercise.name = req.body.name;
    newExercise.weight = req.body.weight;
    newExercise.save((err, data) => {
        if (err) {
            console.log(error);
        }
        else {
            res.redirect('/');
        }
    })

})

app.put('/exercises', (req, res) => {
    ExerciseModel.findOneAndUpdate(
        { name: 'Dumbell Press' },
        {
            name: req.body.name,
            weight: req.body.weight
        },
        {
            new: true,
            upsert: true
        }
    ).then(result => {
        res.json('Success');
    }).catch(error => console.error(error))
})

app.delete('/exercises', async (req, res) => {
    ExerciseModel.deleteOne(
        { name: req.body.name },
    ).then(result => {
        if (result.deletedCount === 0) {
            return res.json('No Barbell Exercise to delete');
        }
        res.json('Deleted a Barbell Exercise');
    }).catch(error => console.error(error))
})

app.listen(port, function () {
    console.log('listening on 3000');
})

