const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { userSchema } = require('./models/User.js');
const { exerciseSchema } = require('./models/User.js');


const stdExercises = [

    new exerciseSchema({
        name: "Bench Press",
        type: "chest"
    }),
    
    new exerciseSchema({
        name: "Skullcrusher",
        type: "triceps"
    }),
    
    new exerciseSchema({
        name: "Back Row",
        type: "back"
    }),
    
    new exerciseSchema({
        name: "Bicep Curl",
        type: "biceps"
    }),
    
    new exerciseSchema({
        name: "Shoulder Press",
        type: "shoulders"
    }),
    
    new exerciseSchema({
        name: "Squat",
        type: "legs"
    }),
    
    new exerciseSchema({
        name: "Situps",
        type: "abs"
    })]

module.exports = function(app) {
    app.use('/user', express.static('public'));

    app.get('/user/signup', (req, res) => {
        res.render('signup.ejs', {loginStatus: "Login / Sign-Up"});
    });

    app.get('/user/login', (req, res) => {
        res.render('login.ejs', {loginStatus: "Login / Sign-Up"});
    });

    app.get('/home/login', (req, res) => {
        res.redirect('/home');
    })

    app.get('/user/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', 'Successfully logged out');
        res.redirect('/user/login');
    })

    app.post('/user/signup', (req, res) => {
        const {username, password, fullname, email} = req.body;
        let errors = []
        if(!username || !password || !fullname || !email) {
            errors.push({msg : "Please fill in all fields"})
        }
        if(password.length < 1 ) {
            errors.push({msg : 'Password at least 6 characters'})
        }
        if (errors.length > 0) {
            res.render('signup.ejs', {
                errors: errors,
                username: username,
                password: password,
                fullname: fullname,
                email: email,
                loginStatus: "Login / Sign-Up" })
        } else {
            userSchema.findOne({username: username}).exec((err, user) => {
                console.log(user);
                if (user) {
                    errors.push({msg : 'Username is already registered!'});
                    res.render('signup.ejs', {
                        errors: errors,
                        username: username,
                        password: password,
                        fullname: fullname,
                        email: email,
                        loginStatus: "Login / Sign-Up" });
                } else {
                    const newUser = new userSchema({
                        username: username,
                        password: password,
                        fullname: fullname,
                        email: email,
                        exercises: stdExercises
                    })
                    bcrypt.genSalt(12, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save().then((value) => {
                                req.flash('success_msg', 'You are now registered')
                                res.redirect('/user/login');
                            }).catch((value) => {console.log(value)})
                        })
                    })
                    

                }
            })
        }
    })

    app.post('/user/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect : '/home/login',
            failureRedirect : '/user/login',
            failureFlash : true,
        }) (req, res, next);
    })
}
