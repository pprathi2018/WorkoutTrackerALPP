const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/User.js");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
            User.findOne({username : username}).then((user) => {
                if (!user) {
                    done(null, false, {message: 'That username is not registered.'});
                }
                if (user) {
                    bcrypt.compare(password, user.password, (err, succ) => {
                        if (err) {
                            throw err;
                        }
                        if (succ) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, {message: 'Password is not correct.'});
                        }
                    })
                }
            }).catch((err) => {console.log(err)})
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(null, user);
        });
    });
}