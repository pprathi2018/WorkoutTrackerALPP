console.log("May Node be with you");

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const connectionString = 'mongodb+srv://andrewlin573:Alin4523$$@cluster0.bv2vu.mongodb.net/andrewlin573?retryWrites=true&w=majority'

const port = 3000;

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
    console.log('Connected to Database');
    const db = client.db('WorkoutTrackerDB');
    const exercisesCollection = db.collection('exercises');
    const usersCollection = db.collection('users');
    var user;

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // ----- ROUTING ----- //
    app.get("/", (req, res) => {
        res.render('index.ejs');
        // db.collection("exercises").find().toArray().then(results => {
        //     res.render('index.ejs', {exercises: results});
        // }).catch(error => console.error(error))
    })

    app.get('/home', (req, res) => {
        res.render('index.ejs');
    })

    app.get('/workouts', (req, res) => {
        res.render('workouts.ejs');
    })

    app.get('/analytics', (req, res) => {
        res.render('analytics.ejs');
    })
    
    app.get('/login', (req, res) => {
        res.render('login.ejs');
    })

    app.get('/users', (req, res) => {
        res.redirect('/login');
    })

    // ----- USERS ----- //
    app.post('/users', (req, res) => {
        usersCollection.insertOne(req.body).then(result => {
            res.redirect('/login');
        }).catch(error => console.error(error))
    })

    app.put('/users', (req, res) => {
        document.getElementById('test').innerHTML("SUCCESS");
        user = usersCollection.findOne(
            {
                username: req.body.username,
                password: req.body.password
            }
        ).then(result => {
            // document.getElementById('test').innerHTML("SUCCESS, name: " + user.username);
            res.redirect('/login')
            // res.json('Success');
        }).catch(error => console.error(error));
    })


    // -----  ----- //


    app.post('/exercises', (req, res) => {
        exercisesCollection.insertOne(req.body).then(result => {
            res.redirect('/');
        }).catch(error => console.error(error))
    })

    app.put('/exercises', (req, res) => {
        exercisesCollection.findOneAndUpdate(
            {name: 'Dumbell Press'},
            {
                $set: {
                    name: req.body.name,
                    weight: req.body.weight
                }
            },
            {
                upsert: true
            }
        ).then(result => {
            res.json('Success');
        }).catch(error => console.error(error))
    })

    app.delete('/exercises', (req, res) => {
        exercisesCollection.deleteOne(
            {name: req.body.name},
        ).then(result => {
            if (result.deletedCount === 0) {
                return res.json('No Barbell Exercise to delete');
            }
            res.json('Deleted a Barbell Exercise');
        }).catch(error => console.error(error))
    })


    app.listen(port, function() {
        console.log('listening on 3000');
    })

}).catch(error => console.error(error))

