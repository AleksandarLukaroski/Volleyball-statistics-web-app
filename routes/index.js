const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res) => {
    if (typeof res.locals.user != "undefined") {
        // console.log(res.locals.user);
        res.render("home page", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
        });
    } else {
        res.render("home page");
    }
});

// My games page
router.get("/mygames", ensureAuthenticated, (req, res) => {
    res.render("my games", {
        name: req.user.first_name + " " + req.user.last_name,
        username: res.locals.user.first_name + " " + res.locals.user.last_name,
    });
});

module.exports = router;
