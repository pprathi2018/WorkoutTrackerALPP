const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User.js');

module.exports = function(app) {
    app.use('/user', express.static('public'));

    app.get('/user/signup', (req, res) => {
        res.render('signup.ejs');
    });

    app.get('/user/login', (req, res) => {
        res.render('login.ejs');
    });

    app.post('/user/signup', (req, res) => {
        const {username, password, fullname, email} = req.body;
        let errors = []
        if(!username || !password || !fullname || !email) {
            errors.push({msg : "Please fill in all fields"})
        }
        if(password.length < 6 ) {
            errors.push({msg : 'Password at least 6 characters'})
        }
        if (errors.length > 0) {
            res.render('signup.ejs', {
                errors: errors,
                username: username,
                password: password,
                fullname: fullname,
                email: email })
        } else {
            User.findOne({username: username}).exec((err, user) => {
                console.log(user);
                if (user) {
                    errors.push({msg : 'Username is already registered!'});
                    res.render('signup.ejs', {
                        errors: errors,
                        username: username,
                        password: password,
                        fullname: fullname,
                        email: email });
                } else {
                    const newUser = new User({
                        username: username,
                        password: password,
                        fullname: fullname,
                        email: email
                    })
                    bcrypt.genSalt(12, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save().then((value) => {
                                res.redirect('/user/login');
                            }).catch((value) => {console.log(value)})
                        })
                    })
                    

                }
            })
        }
    })
}