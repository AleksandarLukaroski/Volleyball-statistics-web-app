const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Connect to Database
const connection = require("../config/database");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                // Match user
                connection.query(
                    "SELECT * FROM users WHERE email = ?",
                    [email],
                    function (err, user) {
                        if (err) throw err;
                        if (user.length == 0) {
                            return done(null, false, {
                                message: "That email is not registered.",
                            });
                        }

                        // if the user is found but the password is wrong
                        bcrypt.compare(
                            password,
                            user[0].password,
                            (err, isMatch) => {
                                if (err) throw err;
                                if (isMatch) {
                                    return done(null, user[0]);
                                } else {
                                    console.log("Pogresen pasvord.");
                                    return done(null, false, {
                                        message: "Password incorrect.",
                                    });
                                }
                            }
                        );
                    }
                );
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        connection.query(
            "SELECT * FROM users WHERE id = ? ",
            [id],
            function (err, rows) {
                done(err, rows[0]);
            }
        );
    });
};
