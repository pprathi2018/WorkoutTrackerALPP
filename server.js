console.log("May Node be with you");

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const connectionString = 'mongodb+srv://pprathi2018:Pr01302k1@cluster0.meoms.mongodb.net/WorkoutTracker?retryWrites=true&w=majority'

const port = 3000;


MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
    console.log('Connected to Database');
    const db = client.db('WorkoutTrackerDB');
    const exercisesCollection = db.collection('exercises');

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    app.get("/", (req, res) => {
        db.collection("exercises").find().toArray().then(results => {
            res.render('index.ejs', {exercises: results});
        }).catch(error => console.error(error))
    })

    app.get('/home', (req, res) => {
        db.collection("exercises").find().toArray().then(results => {
            res.render('index.ejs', {exercises: results});
        }).catch(error => console.error(error))
    })
    
    app.get('/workouts', (req, res) => {
        db.collection("exercises").find().toArray().then(results => {
            res.render('workouts.ejs', {exercises: results});
        }).catch(error => console.error(error))
    })

    app.get('/analytics', (req, res) => {
        db.collection("exercises").find().toArray().then(results => {
            res.render('analytics.ejs', {exercises: results});
        }).catch(error => console.error(error))
    })
    
    app.get('/login', (req, res) => {
        db.collection("exercises").find().toArray().then(results => {
            res.render('login.ejs', {exercises: results});
        }).catch(error => console.error(error))
    })

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

