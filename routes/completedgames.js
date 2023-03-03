const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Connect to Database
const connection = require("../config/database");

router.get("/", (req, res) => {
    if (typeof res.locals.user != "undefined") {
        res.render("completed games", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
        });
    } else {
        res.render("completed games");
    }
});

router.get("/:id", (req, res) => {
    // console.log(req.params.id);

    if (typeof res.locals.user != "undefined") {
        res.render("game statistics", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
        });
    } else {
        res.render("game statistics");
    }
});

module.exports = router;
