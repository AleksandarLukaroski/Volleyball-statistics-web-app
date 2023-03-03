const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

//Connect to Database
const connection = require("../config/database");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
    res.render("register")
);

// Register Handle
router.post("/register", (req, res) => {
    let { firstName, lastName, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields

    if (!firstName || !lastName || !email || !password || !password2) {
        errors.push({ msg: "Please enter all fields." });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters." });
    }

    if (password != password2) {
        errors.push({ msg: "Passwords do not match." });
    }

    if (errors.length > 0) {
        console.log(errors);
        var myArray = [
            [
                { id: 1, name: "Alice" },
                { id: 2, name: "Peter" },
                { id: 3, name: "Harry" },
            ],
            [
                { id: 1, name: "Alice" },
                { id: 2, name: "Gary" },
                { id: 3, name: "Bob" },
            ],
        ];
        // var myArray = {
        //     prvobjekt: [
        //         { id: 1, name: "Alice" },
        //         { id: 2, name: "Peter" },
        //         { id: 3, name: "Harry" },
        //     ],
        //     vtorobjekt: [
        //         { id: 1, name: "Alice" },
        //         { id: 2, name: "Gary" },
        //         { id: 3, name: "Harry" },
        //     ],
        // };

        // Get the Array item which matchs the id "2"
        var result = myArray[1].find((item) => item.id === 2);
        var result = myArray[1][2];
        console.log(result);
        var result = myArray[1][2].name;
        // var result = myArray.prvobjekt.find((item) => item.id === 2);

        console.log(result);
        // console.log(result.name); // Prints: Peter
        res.render("register", {
            errors,
            firstName,
            lastName,
            email,
            password,
            password2,
        });
    } else {
        connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            function (err, rows) {
                if (err) throw err;
                if (rows.length) {
                    req.flash(
                        "error_msg",
                        "The user with that email already exists."
                    );
                    res.redirect("/users/register");
                } else {
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;

                            password = hash;

                            var newUserMysql = {
                                first_name: firstName,
                                last_name: lastName,
                                email: email,
                                password: password,
                            };

                            var insertQuery = "INSERT INTO users SET ? ";
                            connection.query(
                                insertQuery,
                                newUserMysql,
                                (err, result) => {
                                    if (err) throw err;
                                    console.log(result);
                                    console.log(result.insertId);
                                    console.log(
                                        "The user is added to the database."
                                    );
                                    req.flash(
                                        "success_msg",
                                        "You are now registered and can log in."
                                    );
                                    res.redirect("/users/login");
                                }
                            );
                        })
                    );
                }
            }
        );
    }
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/mygames",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "You are logged out.");
        res.redirect("/users/login");
    });
});

module.exports = router;
