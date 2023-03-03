const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
// const mysql = require("mysql");

const app = express();

// Passport Config
require("./config/passport")(passport);

// EJS
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    res.locals.user = req.user;

    res.locals.formNumber = req.flash("formNumber");
    res.locals.numberOfPlayers = req.flash("numberOfPlayers");

    res.locals.submitButtonText = req.flash("submitButtonText");

    res.locals.teamName = req.flash("teamName");
    res.locals.teamId = req.flash("teamId");
    res.locals.gameAttributes = req.flash("gameAttributes");

    //Team players
    res.locals.firstTeamPlayerId = req.flash("firstTeamPlayerId");
    res.locals.firstTeamPlayerJersey = req.flash("firstTeamPlayerJersey");
    res.locals.firstTeamPlayerFirstName = req.flash("firstTeamPlayerFirstName");
    res.locals.firstTeamPlayerLastName = req.flash("firstTeamPlayerLastName");
    res.locals.firstTeamPlayerPosition = req.flash("firstTeamPlayerPosition");
    res.locals.firstTeamPlayerBirthDate = req.flash("firstTeamPlayerBirthDate");
    res.locals.firstTeamPlayerHeight = req.flash("firstTeamPlayerHeight");

    res.locals.secondTeamPlayerId = req.flash("secondTeamPlayerId");
    res.locals.secondTeamPlayerJersey = req.flash("secondTeamPlayerJersey");
    res.locals.secondTeamPlayerFirstName = req.flash(
        "secondTeamPlayerFirstName"
    );
    res.locals.secondTeamPlayerLastName = req.flash("secondTeamPlayerLastName");
    res.locals.secondTeamPlayerPosition = req.flash("secondTeamPlayerPosition");
    res.locals.secondTeamPlayerBirthDate = req.flash(
        "secondTeamPlayerBirthDate"
    );
    res.locals.secondTeamPlayerHeight = req.flash("secondTeamPlayerHeight");

    //Team staff
    res.locals.firstTeamStaffId = req.flash("firstTeamStaffId");
    res.locals.firstTeamStaffFirstName = req.flash("firstTeamStaffFirstName");
    res.locals.firstTeamStaffLastName = req.flash("firstTeamStaffLastName");
    res.locals.firstTeamStaffBirthDate = req.flash("firstTeamStaffBirthDate");

    res.locals.secondTeamStaffId = req.flash("secondTeamStaffId");
    res.locals.secondTeamStaffFirstName = req.flash("secondTeamStaffFirstName");
    res.locals.secondTeamStaffLastName = req.flash("secondTeamStaffLastName");
    res.locals.secondTeamStaffBirthDate = req.flash("secondTeamStaffBirthDate");

    //Team starting lineups
    res.locals.firstTeamCourtPosition = req.flash("firstTeamCourtPosition");
    res.locals.secondTeamCourtPosition = req.flash("secondTeamCourtPosition");

    //Game dashboard information
    res.locals.setId = req.flash("setId");
    res.locals.previousPointWonByTeam = req.flash("previousPointWonByTeam");
    res.locals.resultInSets = req.flash("resultInSets");
    res.locals.currentSetResult = req.flash("currentSetResult");
    res.locals.timeoutsLeft = req.flash("timeoutsLeft");
    res.locals.substitutionsLeft = req.flash("substitutionsLeft");
    //     formName,
    //     setId,
    //     currentSetResult,
    //     teamIndex,
    //     typeOfPoint,
    //     player,
    //     timeoutsLeft,
    //     playerIn,
    //     playerOut,
    //     substitutionsLeft,
    //     typeOfCard,
    //     person,

    next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/addnewgame", require("./routes/addnewgame.js"));
app.use("/livegames", require("./routes/livegames.js"));
app.use("/completedgames", require("./routes/completedgames.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
