const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Connect to Database
const connection = require("../config/database");

// Game information page
router.get("/gameinformation", ensureAuthenticated, (req, res) => {
    res.render("game information", {
        username: res.locals.user.first_name + " " + res.locals.user.last_name,
    });
});

router.post("/gameinformation", ensureAuthenticated, (req, res) => {
    console.log(req.body);
    let { numberOfPlayers, teamName, gameAttributes } = req.body;

    // console.log("The number of players is: " + numberOfPlayers);
    // console.log(teamName);
    // console.log(gameAttributes);

    let errors = [];

    // Check required fields

    if (
        teamName[0] == "" ||
        teamName[1] == "" ||
        gameAttributes[0] == "" ||
        gameAttributes[1] == "" ||
        gameAttributes[2] == "" ||
        gameAttributes[3] == "" ||
        gameAttributes[4] == "" ||
        gameAttributes[5] == "" ||
        gameAttributes[6] == ""
    ) {
        errors.push({ msg: "Please enter all fields." });
    }

    if (errors.length > 0) {
        res.render("game information", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            errors,
            teamName,
            gameAttributes,
        });
    } else {
        // Uspesen post

        //(league, city_and_country, hall, started, ended, privacy, status, first_referee, second_referee, description, user_id)
        connection.query(
            "INSERT INTO game SET ?",
            {
                league: gameAttributes[0],
                city_and_country: gameAttributes[1],
                hall: gameAttributes[2],
                started: null,
                ended: null,
                privacy: gameAttributes[6],
                status: null,
                first_referee: gameAttributes[3],
                second_referee: gameAttributes[4],
                description: gameAttributes[5],
                user_id: req.user.id,
            },
            (err, result) => {
                if (err) throw err;
                console.log(result);
                console.log(result.insertId);
                console.log("The game information is added to the database.");

                let values = [
                    [teamName[0], result.insertId],
                    [teamName[1], result.insertId],
                ];

                connection.query(
                    "INSERT INTO team(name, game_id) VALUES ? ",
                    [values],
                    (err, teamResult) => {
                        if (err) throw err;
                        console.log(teamResult);
                        console.log(teamResult.insertId);
                        console.log(
                            "Both team names are added to the database."
                        );

                        let teamId = [];
                        teamId.push(teamResult.insertId);
                        teamId.push(teamResult.insertId + 1);
                        gameAttributes.push(result.insertId);

                        // console.log(teamName);
                        // console.log(teamId);
                        // console.log(gameAttributes);

                        req.flash("teamName", teamName);
                        req.flash("teamId", teamId);
                        req.flash("gameAttributes", gameAttributes);

                        req.flash("formNumber", "2");
                        req.flash("numberOfPlayers", numberOfPlayers);
                        res.redirect("/addnewgame/addteams");
                    }
                );
            }
        );
    }
});

// Add teams page
router.get("/addteams", ensureAuthenticated, (req, res) => {
    if (res.locals.formNumber.length === 0) {
        console.log("formNumber ne e definiran");
        req.flash(
            "error_msg",
            'You can\'t access this route straight away! You need to fill in the "Game information(1/5)" part of the form first! Click on "Add new game".'
        );
        res.redirect("/mygames");
    } else {
        console.log("Form number: " + res.locals.formNumber);
        console.log(
            "Number of players per team: " + res.locals.numberOfPlayers
        );
        console.log("Game id: " + res.locals.gameAttributes[7]);
        console.log(res.locals.teamName);
        console.log(res.locals.teamId);
        console.log(res.locals.gameAttributes);

        console.log(res.locals.firstTeamPlayerId);
        console.log(res.locals.firstTeamPlayerJersey);
        console.log(res.locals.firstTeamPlayerFirstName);
        console.log(res.locals.firstTeamPlayerLastName);
        console.log(res.locals.firstTeamPlayerPosition);

        console.log(res.locals.firstTeamStaffId);
        console.log(res.locals.firstTeamStaffFirstName);
        console.log(res.locals.firstTeamStaffLastName);

        res.render("add teams", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            teamName: res.locals.teamName,
            teamId: res.locals.teamId,
            gameAttributes: res.locals.gameAttributes,

            firstTeamPlayerId: res.locals.firstTeamPlayerId,
            firstTeamPlayerJersey: res.locals.firstTeamPlayerJersey,
            firstTeamPlayerFirstName: res.locals.firstTeamPlayerFirstName,
            firstTeamPlayerLastName: res.locals.firstTeamPlayerLastName,
            firstTeamPlayerPosition: res.locals.firstTeamPlayerPosition,

            firstTeamStaffId: res.locals.firstTeamStaffId,
            firstTeamStaffFirstName: res.locals.firstTeamStaffFirstName,
            firstTeamStaffLastName: res.locals.firstTeamStaffLastName,
        });
    }
});

router.post("/addteams", ensureAuthenticated, (req, res) => {
    console.log(req.body);
    let {
        formNumber,
        numberOfPlayers,
        teamName,
        teamId,
        gameAttributes,

        staffFirstName,
        staffLastName,
        staffBirthDate,

        playerJersey,
        playerFirstName,
        playerLastName,
        playerPosition,
        playerBirthDate,
        playerHeight,

        firstTeamPlayerId,
        firstTeamPlayerJersey,
        firstTeamPlayerFirstName,
        firstTeamPlayerLastName,
        firstTeamPlayerPosition,

        firstTeamStaffId,
        firstTeamStaffFirstName,
        firstTeamStaffLastName,
    } = req.body;

    // console.log(teamName);
    // console.log(teamId);

    let errors = [];

    // Check required fields

    for (let i = 0; i < numberOfPlayers; i++) {
        // Check Staff and Players required fields

        if (i < 3) {
            if (
                staffFirstName[i] == "" ||
                staffLastName[i] == "" ||
                staffBirthDate[i] == ""
            ) {
                errors.push({ msg: "Please enter all fields." });
                break;
            }
        }

        if (
            playerJersey[i] == "" ||
            playerFirstName[i] == "" ||
            playerLastName[i] == "" ||
            playerPosition[i] == "" ||
            playerBirthDate[i] == "" ||
            playerHeight[i] == ""
        ) {
            errors.push({ msg: "Please enter all fields." });
            break;
        }
    }

    if (errors.length > 0) {
        res.render("add teams", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            errors,
            formNumber,
            numberOfPlayers,
            teamName,
            teamId,
            gameAttributes,

            staffFirstName,
            staffLastName,
            staffBirthDate,

            // playerInfo,
            playerJersey,
            playerFirstName,
            playerLastName,
            playerPosition,
            playerBirthDate,
            playerHeight,

            firstTeamPlayerId,
            firstTeamPlayerJersey,
            firstTeamPlayerFirstName,
            firstTeamPlayerLastName,
            firstTeamPlayerPosition,

            firstTeamStaffId,
            firstTeamStaffFirstName,
            firstTeamStaffLastName,
        });
    } else if (formNumber == 2) {
        // Uspesen post

        let playerValues = [];
        for (let i = 0; i < numberOfPlayers; i++) {
            playerValues.push([
                playerFirstName[i],
                playerLastName[i],
                playerBirthDate[i],
                playerJersey[i],
                playerPosition[i],
                playerHeight[i],
                teamId[0],
            ]);
        }

        console.log(playerValues);

        connection.query(
            "INSERT INTO player(first_name, last_name, birth_date, jersey, position, height, team_id) VALUES ? ",
            [playerValues],
            (err, playerResult) => {
                if (err) throw err;
                console.log(playerResult);
                console.log(playerResult.insertId);
                console.log("All players are added to the database.");

                let staffValues = [];
                staffValues = [
                    [
                        staffFirstName[0],
                        staffLastName[0],
                        staffBirthDate[0],
                        "Head coach",
                        teamId[0],
                    ],
                    [
                        staffFirstName[1],
                        staffLastName[1],
                        staffBirthDate[1],
                        "Second coach",
                        teamId[0],
                    ],
                    [
                        staffFirstName[2],
                        staffLastName[2],
                        staffBirthDate[2],
                        "Team doctor",
                        teamId[0],
                    ],
                ];

                console.log(staffValues);

                connection.query(
                    "INSERT INTO staff(first_name, last_name, birth_date, role, team_id) VALUES ? ",
                    [staffValues],
                    (err, staffResult) => {
                        if (err) throw err;
                        console.log(staffResult);
                        console.log(staffResult.insertId);
                        console.log(
                            "All staff members are added to the database."
                        );

                        // Dodaj gi podatocite za timovite i natprevarot
                        req.flash("formNumber", "3");
                        req.flash("numberOfPlayers", numberOfPlayers);
                        req.flash("teamName", teamName);
                        req.flash("teamId", teamId);
                        req.flash("gameAttributes", gameAttributes);

                        // Players info
                        let playerIds = [];

                        for (let i = 0; i < numberOfPlayers; i++) {
                            playerIds.push(playerResult.insertId + i);
                        }
                        // console.log(playerIds);

                        req.flash("firstTeamPlayerId", playerIds);
                        req.flash("firstTeamPlayerJersey", playerJersey);
                        req.flash("firstTeamPlayerFirstName", playerFirstName);
                        req.flash("firstTeamPlayerLastName", playerLastName);
                        req.flash("firstTeamPlayerPosition", playerPosition);
                        req.flash("firstTeamPlayerBirthDate", playerBirthDate);
                        req.flash("firstTeamPlayerHeight", playerHeight);

                        // Staff info
                        let staffIds = [];

                        for (let i = 0; i < 3; i++) {
                            staffIds.push(staffResult.insertId + i);
                        }
                        console.log(staffIds);

                        req.flash("firstTeamStaffId", staffIds);
                        req.flash("firstTeamStaffFirstName", staffFirstName);
                        req.flash("firstTeamStaffLastName", staffLastName);
                        req.flash("firstTeamStaffBirthDate", staffBirthDate);

                        res.redirect("/addnewgame/addteams");
                    }
                );
            }
        );
    } else if (formNumber == 3) {
        // Uspesen post

        let playerValues = [];
        for (let i = 0; i < numberOfPlayers; i++) {
            playerValues.push([
                playerFirstName[i],
                playerLastName[i],
                playerBirthDate[i],
                playerJersey[i],
                playerPosition[i],
                playerHeight[i],
                teamId[1],
            ]);
        }

        console.log(playerValues);

        connection.query(
            "INSERT INTO player(first_name, last_name, birth_date, jersey, position, height, team_id) VALUES ? ",
            [playerValues],
            (err, playerResult) => {
                if (err) throw err;
                console.log(playerResult);
                console.log(playerResult.insertId);
                console.log("All players are added to the database.");

                let staffValues = [];
                staffValues = [
                    [
                        staffFirstName[0],
                        staffLastName[0],
                        staffBirthDate[0],
                        "Head coach",
                        teamId[1],
                    ],
                    [
                        staffFirstName[1],
                        staffLastName[1],
                        staffBirthDate[1],
                        "Second coach",
                        teamId[1],
                    ],
                    [
                        staffFirstName[2],
                        staffLastName[2],
                        staffBirthDate[2],
                        "Team doctor",
                        teamId[1],
                    ],
                ];

                console.log(staffValues);

                connection.query(
                    "INSERT INTO staff(first_name, last_name, birth_date, role, team_id) VALUES ? ",
                    [staffValues],
                    (err, staffResult) => {
                        if (err) throw err;
                        console.log(staffResult);
                        console.log(staffResult.insertId);
                        console.log(
                            "All staff members are added to the database."
                        );

                        // Dodaj gi podatocite za timovite i natprevarot
                        req.flash("formNumber", "4");
                        req.flash("numberOfPlayers", numberOfPlayers);
                        req.flash("teamName", teamName);
                        req.flash("teamId", teamId);
                        req.flash("gameAttributes", gameAttributes);

                        // Players info
                        req.flash("firstTeamPlayerId", firstTeamPlayerId);
                        req.flash(
                            "firstTeamPlayerJersey",
                            firstTeamPlayerJersey
                        );
                        req.flash(
                            "firstTeamPlayerFirstName",
                            firstTeamPlayerFirstName
                        );
                        req.flash(
                            "firstTeamPlayerLastName",
                            firstTeamPlayerLastName
                        );
                        req.flash(
                            "firstTeamPlayerPosition",
                            firstTeamPlayerPosition
                        );
                        // req.flash(
                        //     "firstTeamPlayerBirthDate",
                        //     firstTeamPlayerBirthDate
                        // );
                        // req.flash(
                        //     "firstTeamPlayerHeight",
                        //     firstTeamPlayerHeight
                        // );

                        let playerIds = [];

                        for (let i = 0; i < numberOfPlayers; i++) {
                            playerIds.push(playerResult.insertId + i);
                        }
                        // console.log(playerIds);

                        req.flash("secondTeamPlayerId", playerIds);
                        req.flash("secondTeamPlayerJersey", playerJersey);
                        req.flash("secondTeamPlayerFirstName", playerFirstName);
                        req.flash("secondTeamPlayerLastName", playerLastName);
                        req.flash("secondTeamPlayerPosition", playerPosition);
                        req.flash("secondTeamPlayerBirthDate", playerBirthDate);
                        req.flash("secondTeamPlayerHeight", playerHeight);

                        // Staff info
                        let staffIds = [];

                        for (let i = 0; i < 3; i++) {
                            staffIds.push(staffResult.insertId + i);
                        }
                        console.log(staffIds);

                        req.flash("firstTeamStaffId", firstTeamStaffId);
                        req.flash(
                            "firstTeamStaffFirstName",
                            firstTeamStaffFirstName
                        );
                        req.flash(
                            "firstTeamStaffLastName",
                            firstTeamStaffLastName
                        );
                        // req.flash(
                        //     "firstTeamStaffBirthDate",
                        //     firstTeamStaffBirthDate
                        // );

                        req.flash("secondTeamStaffId", staffIds);
                        req.flash("secondTeamStaffFirstName", staffFirstName);
                        req.flash("secondTeamStaffLastName", staffLastName);
                        req.flash("secondTeamStaffBirthDate", staffBirthDate);

                        req.flash("submitButtonText", "Next");
                        res.redirect("/addnewgame/startinglineup");
                    }
                );
            }
        );
    }
});

// Starting lineup page
router.get("/startinglineup", ensureAuthenticated, (req, res) => {
    if (res.locals.formNumber.length === 0) {
        console.log("formNumber ne e definiran");
        req.flash(
            "error_msg",
            'You can\'t access this route straight away! You need to fill in the "Game information(1/5)" part of the form first! Click on "Add new game".'
        );
        res.redirect("/mygames");
    } else {
        console.log("Form number: " + res.locals.formNumber);
        console.log(
            "Number of players per team: " + res.locals.numberOfPlayers
        );
        console.log("Game id: " + res.locals.gameAttributes[7]);
        console.log(res.locals.teamName);
        console.log(res.locals.teamId);
        console.log(res.locals.gameAttributes);

        console.log(res.locals.firstTeamPlayerId);
        console.log(res.locals.firstTeamPlayerJersey);
        console.log(res.locals.firstTeamPlayerFirstName);
        console.log(res.locals.firstTeamPlayerLastName);
        console.log(res.locals.firstTeamPlayerPosition);

        console.log(res.locals.secondTeamPlayerId);
        console.log(res.locals.secondTeamPlayerJersey);
        console.log(res.locals.secondTeamPlayerFirstName);
        console.log(res.locals.secondTeamPlayerLastName);
        console.log(res.locals.secondTeamPlayerPosition);

        //Team staff
        console.log(res.locals.firstTeamStaffId);
        console.log(res.locals.firstTeamStaffFirstName);
        console.log(res.locals.firstTeamStaffLastName);

        console.log(res.locals.secondTeamStaffId);
        console.log(res.locals.secondTeamStaffFirstName);
        console.log(res.locals.secondTeamStaffLastName);

        console.log(res.locals.firstTeamCourtPosition);

        res.render("starting lineup", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            teamInfo: res.locals.teamInfo,
            gameInfo: res.locals.gameInfo,
            firstTeamPlayerId: res.locals.firstTeamPlayerId,
            firstTeamPlayerJersey: res.locals.firstTeamPlayerJersey,
            firstTeamPlayerFirstName: res.locals.firstTeamPlayerFirstName,
            firstTeamPlayerLastName: res.locals.firstTeamPlayerLastName,
            firstTeamPlayerPosition: res.locals.firstTeamPlayerPosition,

            firstTeamStaffId: res.locals.firstTeamStaffId,
            firstTeamStaffFirstName: res.locals.firstTeamStaffFirstName,
            firstTeamStaffLastName: res.locals.firstTeamStaffLastName,

            secondTeamPlayerId: res.locals.secondTeamPlayerId,
            secondTeamPlayerJersey: res.locals.secondTeamPlayerJersey,
            secondTeamPlayerFirstName: res.locals.secondTeamPlayerFirstName,
            secondTeamPlayerLastName: res.locals.secondTeamPlayerLastName,
            secondTeamPlayerPosition: res.locals.secondTeamPlayerPosition,

            secondTeamStaffId: res.locals.secondTeamStaffId,
            secondTeamStaffFirstName: res.locals.secondTeamStaffFirstName,
            secondTeamStaffLastName: res.locals.secondTeamStaffLastName,

            firstTeamCourtPosition: res.locals.firstTeamCourtPosition,
        });
    }
});

router.post("/startinglineup", ensureAuthenticated, (req, res) => {
    console.log(req.body);
    let {
        formNumber,
        numberOfPlayers,
        teamName,
        teamId,
        gameAttributes,
        submitButtonText,

        firstTeamPlayerId,
        firstTeamPlayerJersey,
        firstTeamPlayerFirstName,
        firstTeamPlayerLastName,
        firstTeamPlayerPosition,

        firstTeamStaffId,
        firstTeamStaffFirstName,
        firstTeamStaffLastName,

        secondTeamPlayerId,
        secondTeamPlayerJersey,
        secondTeamPlayerFirstName,
        secondTeamPlayerLastName,
        secondTeamPlayerPosition,

        secondTeamStaffId,
        secondTeamStaffFirstName,
        secondTeamStaffLastName,

        courtPosition,
        firstTeamCourtPosition,
        // libero,
    } = req.body;

    console.log(teamName);
    console.log(teamId);
    console.log(gameAttributes);

    console.log(firstTeamPlayerId);
    console.log(firstTeamPlayerFirstName);
    console.log(firstTeamPlayerLastName);

    console.log(firstTeamCourtPosition);
    console.log(courtPosition);

    if (formNumber == 4) {
        let indeksNaIgracotVoNizata = firstTeamPlayerId.indexOf(
            courtPosition[0]
        );
        console.log(
            "Imeto na igracot e: " +
                firstTeamPlayerFirstName[indeksNaIgracotVoNizata]
        );
        console.log(
            "Prezimeto na igracot e: " +
                firstTeamPlayerLastName[indeksNaIgracotVoNizata]
        );
    } else if (formNumber == 5) {
        let indeksNaIgracotVoNizata = secondTeamPlayerId.indexOf(
            courtPosition[0]
        );
        console.log(
            "Imeto na igracot e: " +
                secondTeamPlayerFirstName[indeksNaIgracotVoNizata]
        );
        console.log(
            "Prezimeto na igracot e: " +
                secondTeamPlayerLastName[indeksNaIgracotVoNizata]
        );
    }

    let errors = [];

    // Check required fields

    for (let i = 0; i < 6; i++) {
        if (courtPosition[i] == "") {
            errors.push({ msg: "Please enter all fields." });
            break;
        }
    }

    if (errors.length > 0) {
        res.render("starting lineup", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            formNumber,
            numberOfPlayers,
            teamName,
            teamId,
            gameAttributes,
            submitButtonText,

            firstTeamPlayerId,
            firstTeamPlayerJersey,
            firstTeamPlayerFirstName,
            firstTeamPlayerLastName,
            firstTeamPlayerPosition,

            firstTeamStaffId,
            firstTeamStaffFirstName,
            firstTeamStaffLastName,

            secondTeamPlayerId,
            secondTeamPlayerJersey,
            secondTeamPlayerFirstName,
            secondTeamPlayerLastName,
            secondTeamPlayerPosition,

            secondTeamStaffId,
            secondTeamStaffFirstName,
            secondTeamStaffLastName,

            courtPosition,
            firstTeamCourtPosition,
        });
    } else if (formNumber == 4) {
        req.flash("formNumber", "5");
        req.flash("numberOfPlayers", numberOfPlayers);

        req.flash("teamName", teamName);
        req.flash("teamId", teamId);
        req.flash("gameAttributes", gameAttributes);

        // Players info
        req.flash("firstTeamPlayerId", firstTeamPlayerId);
        req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
        req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
        req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
        req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

        req.flash("secondTeamPlayerId", secondTeamPlayerId);
        req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
        req.flash("secondTeamPlayerFirstName", secondTeamPlayerFirstName);
        req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
        req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
        // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
        // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

        // Staff info
        req.flash("firstTeamStaffId", firstTeamStaffId);
        req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
        req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

        req.flash("secondTeamStaffId", secondTeamStaffId);
        req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
        req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
        // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

        req.flash("firstTeamCourtPosition", courtPosition);

        req.flash("submitButtonText", "Start game");
        res.redirect("/addnewgame/startinglineup");
    } else if (formNumber == 5) {
        let previousPointWonByTeam = null;
        let resultInSets = [0, 0];
        let currentSetResult = [0, 0];
        let timeoutsLeft = [2, 2];
        let substitutionsLeft = [15, 15];

        connection.query(
            "INSERT INTO sets SET ?",
            {
                ended: null,
                set_won_by_team: null,
                first_team_timeouts: timeoutsLeft[0],
                second_team_timeouts: timeoutsLeft[1],
                first_team_substitutions: substitutionsLeft[0],
                second_team_substitutions: substitutionsLeft[1],
                game_id: gameAttributes[7],
            },
            (err, setResult) => {
                if (err) throw err;
                console.log(setResult);
                console.log(setResult.insertId);
                console.log("The set information is added to the database.");

                connection.query(
                    "INSERT INTO point SET ?",
                    {
                        first_team_result: currentSetResult[0],
                        second_team_result: currentSetResult[1],
                        previous_point_won_by_team: previousPointWonByTeam,
                        type_of_point: null,
                        won_by_player: firstTeamPlayerId[1],
                        left1: firstTeamCourtPosition[0],
                        left2: firstTeamCourtPosition[1],
                        left3: firstTeamCourtPosition[2],
                        left4: firstTeamCourtPosition[3],
                        left5: firstTeamCourtPosition[4],
                        left6: firstTeamCourtPosition[5],
                        right1: courtPosition[0],
                        right2: courtPosition[1],
                        right3: courtPosition[2],
                        right4: courtPosition[3],
                        right5: courtPosition[4],
                        right6: courtPosition[5],
                        sets_id: setResult.insertId,
                    },
                    (err, pointResult) => {
                        if (err) throw err;
                        console.log(pointResult);
                        console.log(pointResult.insertId);
                        console.log(
                            "The point information is added to the database."
                        );

                        //ended=CURRENT_TIMESTAMP WHERE id=2
                        connection.query(
                            `UPDATE game SET started=CURRENT_TIMESTAMP, status='live' WHERE id=${gameAttributes[7]}`,
                            (err, gameResult) => {
                                if (err) throw err;
                                console.log(gameResult);
                                console.log("Game id is: " + gameAttributes[7]);
                                console.log(
                                    "The game Started and Status columns are updated."
                                );

                                req.flash("formNumber", "6");
                                req.flash("numberOfPlayers", numberOfPlayers);

                                req.flash("teamName", teamName);
                                req.flash("teamId", teamId);
                                req.flash("gameAttributes", gameAttributes);

                                // Players info
                                req.flash(
                                    "firstTeamPlayerId",
                                    firstTeamPlayerId
                                );
                                req.flash(
                                    "firstTeamPlayerJersey",
                                    firstTeamPlayerJersey
                                );
                                req.flash(
                                    "firstTeamPlayerFirstName",
                                    firstTeamPlayerFirstName
                                );
                                req.flash(
                                    "firstTeamPlayerLastName",
                                    firstTeamPlayerLastName
                                );
                                req.flash(
                                    "firstTeamPlayerPosition",
                                    firstTeamPlayerPosition
                                );

                                req.flash(
                                    "secondTeamPlayerId",
                                    secondTeamPlayerId
                                );
                                req.flash(
                                    "secondTeamPlayerJersey",
                                    secondTeamPlayerJersey
                                );
                                req.flash(
                                    "secondTeamPlayerFirstName",
                                    secondTeamPlayerFirstName
                                );
                                req.flash(
                                    "secondTeamPlayerLastName",
                                    secondTeamPlayerLastName
                                );
                                req.flash(
                                    "secondTeamPlayerPosition",
                                    secondTeamPlayerPosition
                                );
                                // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
                                // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

                                // Staff info
                                req.flash("firstTeamStaffId", firstTeamStaffId);
                                req.flash(
                                    "firstTeamStaffFirstName",
                                    firstTeamStaffFirstName
                                );
                                req.flash(
                                    "firstTeamStaffLastName",
                                    firstTeamStaffLastName
                                );

                                req.flash(
                                    "secondTeamStaffId",
                                    secondTeamStaffId
                                );
                                req.flash(
                                    "secondTeamStaffFirstName",
                                    secondTeamStaffFirstName
                                );
                                req.flash(
                                    "secondTeamStaffLastName",
                                    secondTeamStaffLastName
                                );
                                // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

                                //Team starting lineups
                                req.flash(
                                    "firstTeamCourtPosition",
                                    firstTeamCourtPosition
                                );
                                req.flash(
                                    "secondTeamCourtPosition",
                                    courtPosition
                                );

                                //Game dashboard information
                                req.flash("setId", setResult.insertId);
                                req.flash(
                                    "previousPointWonByTeam",
                                    setResult.previousPointWonByTeam
                                );
                                req.flash("resultInSets", resultInSets);
                                req.flash("currentSetResult", currentSetResult);
                                req.flash("timeoutsLeft", timeoutsLeft);
                                req.flash(
                                    "substitutionsLeft",
                                    substitutionsLeft
                                );

                                res.redirect(
                                    "/addnewgame/gamedashboard/" +
                                        gameAttributes[7]
                                );
                            }
                        );
                    }
                );
            }
        );
    }
});

// Game dashboard page
router.get("/gamedashboard/:id", ensureAuthenticated, (req, res) => {
    if (res.locals.formNumber.length === 0) {
        console.log("formNumber ne e definiran");
        req.flash(
            "error_msg",
            'You can\'t access this route straight away! You need to fill in the "Game information(1/5)" part of the form first! Click on "Add new game".'
        );
        res.redirect("/mygames");
    } else {
        console.log("Form number: " + res.locals.formNumber);
        console.log("Game id: " + res.locals.gameAttributes[7]);
        console.log(res.locals.teamName);
        console.log(res.locals.teamId);
        console.log(res.locals.gameAttributes);

        //Team players
        console.log(res.locals.firstTeamPlayerId);
        console.log(res.locals.firstTeamPlayerJersey);
        console.log(res.locals.firstTeamPlayerFirstName);
        console.log(res.locals.firstTeamPlayerLastName);
        console.log(res.locals.firstTeamPlayerPosition);

        console.log(res.locals.secondTeamPlayerId);
        console.log(res.locals.secondTeamPlayerJersey);
        console.log(res.locals.secondTeamPlayerFirstName);
        console.log(res.locals.secondTeamPlayerLastName);
        console.log(res.locals.secondTeamPlayerPosition);

        //Team staff
        console.log(res.locals.firstTeamStaffId);
        console.log(res.locals.firstTeamStaffFirstName);
        console.log(res.locals.firstTeamStaffLastName);

        console.log(res.locals.secondTeamStaffId);
        console.log(res.locals.secondTeamStaffFirstName);
        console.log(res.locals.secondTeamStaffLastName);

        //Team starting lineups
        console.log(res.locals.firstTeamCourtPosition);
        console.log(res.locals.secondTeamCourtPosition);

        //Game dashboard information
        console.log(res.locals.setId);
        console.log(res.locals.previousPointWonByTeam);
        console.log(res.locals.resultInSets);
        console.log(res.locals.currentSetResult);
        console.log(res.locals.timeoutsLeft);
        console.log(res.locals.substitutionsLeft);

        res.render("game dashboard", {
            username:
                res.locals.user.first_name + " " + res.locals.user.last_name,
            teamInfo: res.locals.teamName,
            teamInfo: res.locals.teamId,
            gameInfo: res.locals.gameAttributes,

            firstTeamPlayerId: res.locals.firstTeamPlayerId,
            firstTeamPlayerJersey: res.locals.firstTeamPlayerJersey,
            firstTeamPlayerFirstName: res.locals.firstTeamPlayerFirstName,
            firstTeamPlayerLastName: res.locals.firstTeamPlayerLastName,
            firstTeamPlayerPosition: res.locals.firstTeamPlayerPosition,

            firstTeamStaffId: res.locals.firstTeamStaffId,
            firstTeamStaffFirstName: res.locals.firstTeamStaffFirstName,
            firstTeamStaffLastName: res.locals.firstTeamStaffLastName,

            secondTeamPlayerId: res.locals.secondTeamPlayerId,
            secondTeamPlayerJersey: res.locals.secondTeamPlayerJersey,
            secondTeamPlayerFirstName: res.locals.secondTeamPlayerFirstName,
            secondTeamPlayerLastName: res.locals.secondTeamPlayerLastName,
            secondTeamPlayerPosition: res.locals.secondTeamPlayerPosition,

            secondTeamStaffId: res.locals.secondTeamStaffId,
            secondTeamStaffFirstName: res.locals.secondTeamStaffFirstName,
            secondTeamStaffLastName: res.locals.secondTeamStaffLastName,

            firstTeamCourtPosition: res.locals.firstTeamCourtPosition,
            secondTeamCourtPosition: res.locals.secondTeamCourtPosition,

            setId: res.locals.setId,
            previousPointWonByTeam: res.locals.previousPointWonByTeam,
            resultInSets: res.locals.resultInSets,
            currentSetResult: res.locals.currentSetResult,
            timeoutsLeft: res.locals.timeoutsLeft,
            substitutionsLeft: res.locals.substitutionsLeft,
        });
    }
});

router.post("/gamedashboard/:id", ensureAuthenticated, (req, res) => {
    console.log(req.body);
    let {
        formNumber,
        numberOfPlayers,
        teamName,
        teamId,
        gameAttributes,
        // submitButtonText,

        firstTeamPlayerId,
        firstTeamPlayerJersey,
        firstTeamPlayerFirstName,
        firstTeamPlayerLastName,
        firstTeamPlayerPosition,

        firstTeamStaffId,
        firstTeamStaffFirstName,
        firstTeamStaffLastName,

        secondTeamPlayerId,
        secondTeamPlayerJersey,
        secondTeamPlayerFirstName,
        secondTeamPlayerLastName,
        secondTeamPlayerPosition,

        secondTeamStaffId,
        secondTeamStaffFirstName,
        secondTeamStaffLastName,

        firstTeamCourtPosition,
        secondTeamCourtPosition,

        formName,
        setId,
        previousPointWonByTeam,
        resultInSets,
        currentSetResult,
        teamIndex,
        typeOfPoint,
        player,
        timeoutsLeft,
        playerIn,
        playerOut,
        substitutionsLeft,
        typeOfCard,
        person,
    } = req.body;
    console.log("Game ID is: " + req.params.id);

    if (formName == "addNewPoint") {
        //proveri da ne e 5ti set- da e do 15 poeni, mesto do 25??  resultInSets[0]+resultInSets[1]<5
        //proveri koga da se zavrsi igrata spored rez vo setovi- resultInSets[]
        //updejtiraj koj go osvoil setot koga ke zavrsi vo bazata
        //proveri rez dali e 25 i 2 razlika
        //rotiraj gi igracite po osvoen poen

        // if (resultInSets[0] + resultInSets[1] == 4) {
        //     //da se igra do 15poena
        //     console.log("5-ti set se igra do 15 poena!");
        // }
        // if (resultInSets[0] == 3 || resultInSets[1] == 3) {
        //     //completed game
        //     console.log("Igrata zavrsi!");
        //     //azuriraj vo Status:completed vo bazata
        // }

        if (Math.abs(currentSetResult[0] - currentSetResult[1]) >= 2) {
            if (currentSetResult[0] >= 25 || currentSetResult[1] >= 25) {
                //zavrsi go setot
                console.log("Setot zavrsi!");

                if (currentSetResult[0] > currentSetResult[1]) {
                    resultInSets[0]++;
                    currentSetResult = [0, 0];
                    console.log(`Set won by team: ${teamName[0]}.`);
                } else {
                    resultInSets[1]++;
                    currentSetResult = [0, 0];
                    console.log(`Set won by team: ${teamName[1]}.`);
                }

                //updejtiraj koj go osvoil setot(koga ke zavrsi) vo bazata- set_won_by_team kolona
            }
        }

        // rotate players
        if (
            previousPointWonByTeam != "" &&
            previousPointWonByTeam != teamId[teamIndex]
        ) {
            if (teamIndex == 0) {
                let temp = firstTeamCourtPosition[0];
                for (let i = 0; i < 5; i++) {
                    firstTeamCourtPosition[i] = firstTeamCourtPosition[i + 1];
                }
                firstTeamCourtPosition[5] = temp;
            } else {
                let temp = secondTeamCourtPosition[0];
                for (let i = 0; i < 5; i++) {
                    secondTeamCourtPosition[i] = secondTeamCourtPosition[i + 1];
                }
                secondTeamCourtPosition[5] = temp;
            }
        }

        //smeni go previousPointWonByTeam
        if (previousPointWonByTeam === "") {
            previousPointWonByTeam = teamId[teamIndex];
        }

        //zgolemi go rezultatot za 1 i dodaj go vo bazata
        currentSetResult[teamIndex]++;
        console.log(currentSetResult[teamIndex]);

        connection.query(
            "INSERT INTO point SET ?",
            {
                first_team_result: currentSetResult[0],
                second_team_result: currentSetResult[1],
                previous_point_won_by_team: previousPointWonByTeam,
                type_of_point: typeOfPoint,
                won_by_player: player[teamIndex],
                left1: firstTeamCourtPosition[0],
                left2: firstTeamCourtPosition[1],
                left3: firstTeamCourtPosition[2],
                left4: firstTeamCourtPosition[3],
                left5: firstTeamCourtPosition[4],
                left6: firstTeamCourtPosition[5],
                right1: secondTeamCourtPosition[0],
                right2: secondTeamCourtPosition[1],
                right3: secondTeamCourtPosition[2],
                right4: secondTeamCourtPosition[3],
                right5: secondTeamCourtPosition[4],
                right6: secondTeamCourtPosition[5],
                sets_id: setId,
            },
            (err, pointResult) => {
                if (err) throw err;
                console.log(pointResult);
                console.log(pointResult.insertId);
                console.log("The game result is successfully updated.");

                req.flash("formNumber", formNumber);
                req.flash("numberOfPlayers", numberOfPlayers);

                req.flash("teamName", teamName);
                req.flash("teamId", teamId);
                req.flash("gameAttributes", gameAttributes);

                // Players info
                req.flash("firstTeamPlayerId", firstTeamPlayerId);
                req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
                req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
                req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
                req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

                req.flash("secondTeamPlayerId", secondTeamPlayerId);
                req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
                req.flash(
                    "secondTeamPlayerFirstName",
                    secondTeamPlayerFirstName
                );
                req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
                req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
                // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
                // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

                // Staff info
                req.flash("firstTeamStaffId", firstTeamStaffId);
                req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
                req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

                req.flash("secondTeamStaffId", secondTeamStaffId);
                req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
                req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
                // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

                //Team starting lineups
                req.flash("firstTeamCourtPosition", firstTeamCourtPosition);
                req.flash("secondTeamCourtPosition", secondTeamCourtPosition);

                //Game dashboard information
                req.flash("setId", setId);
                req.flash("previousPointWonByTeam", teamId[teamIndex]);
                req.flash("resultInSets", resultInSets);
                req.flash("currentSetResult", currentSetResult);
                req.flash("timeoutsLeft", timeoutsLeft);
                req.flash("substitutionsLeft", substitutionsLeft);

                req.flash(
                    "success_msg",
                    `The game result is successfully updated. Point for team: ${teamName[teamIndex]}.`
                );

                res.redirect("/addnewgame/gamedashboard/" + gameAttributes[7]);
            }
        );
    } else if (formName == "callTimeOut") {
        if (
            (teamIndex == 0 && timeoutsLeft[0] == 0) ||
            (teamIndex == 1 && timeoutsLeft[1] == 0)
        ) {
            //ako brojot na timeouti za toj tim e vekje 0, prati Flash poraka deka ne moze da svika timeout
            console.log(
                "Ne moze da se svika timeout!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            );

            console.log(timeoutsLeft);
            console.log("Ostanati tajmouti za 1 tim: " + timeoutsLeft[0]);
            console.log("Ostanati tajmouti za 2 tim: " + timeoutsLeft[1]);
            console.log("Ostanati tajmouti: " + timeoutsLeft);

            req.flash("formNumber", formNumber);
            req.flash("numberOfPlayers", numberOfPlayers);

            req.flash("teamName", teamName);
            req.flash("teamId", teamId);
            req.flash("gameAttributes", gameAttributes);

            // Players info
            req.flash("firstTeamPlayerId", firstTeamPlayerId);
            req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
            req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
            req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
            req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

            req.flash("secondTeamPlayerId", secondTeamPlayerId);
            req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
            req.flash("secondTeamPlayerFirstName", secondTeamPlayerFirstName);
            req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
            req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
            // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
            // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

            // Staff info
            req.flash("firstTeamStaffId", firstTeamStaffId);
            req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
            req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

            req.flash("secondTeamStaffId", secondTeamStaffId);
            req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
            req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
            // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

            //Team starting lineups
            req.flash("firstTeamCourtPosition", firstTeamCourtPosition);
            req.flash("secondTeamCourtPosition", secondTeamCourtPosition);

            //Game dashboard information
            req.flash("setId", setId);
            req.flash("previousPointWonByTeam", previousPointWonByTeam);
            req.flash("resultInSets", resultInSets);
            req.flash("currentSetResult", currentSetResult);
            req.flash("timeoutsLeft", timeoutsLeft);
            req.flash("substitutionsLeft", substitutionsLeft);

            req.flash(
                "error_msg",
                `Can't call timeout for team: ${teamName[teamIndex]}.`
            );

            res.redirect("/addnewgame/gamedashboard/" + gameAttributes[7]);
        } else {
            let sql = "";

            if (teamIndex == 0 && timeoutsLeft[0] != 0) {
                sql = `UPDATE sets SET first_team_timeouts=${--timeoutsLeft[0]} WHERE id=${setId}`;
                console.log(`Timeout for team: ${teamName[0]}.`);
            } else if (teamIndex == 1 && timeoutsLeft[1] != 0) {
                sql = `UPDATE sets SET second_team_timeouts=${--timeoutsLeft[1]} WHERE id=${setId}`;
                console.log(`Timeout for team: ${teamName[1]}.`);
            }

            console.log(timeoutsLeft);
            console.log("Ostanati tajmouti: " + timeoutsLeft[1]);
            console.log("Ostanati tajmouti: " + timeoutsLeft);

            connection.query(sql, (err, setResult) => {
                if (err) throw err;
                console.log(setResult);
                console.log("Game id is: " + gameAttributes[7]);
                console.log("Timeout for team: " + teamName[teamIndex]);

                req.flash("formNumber", formNumber);
                req.flash("numberOfPlayers", numberOfPlayers);

                req.flash("teamName", teamName);
                req.flash("teamId", teamId);
                req.flash("gameAttributes", gameAttributes);

                // Players info
                req.flash("firstTeamPlayerId", firstTeamPlayerId);
                req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
                req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
                req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
                req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

                req.flash("secondTeamPlayerId", secondTeamPlayerId);
                req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
                req.flash(
                    "secondTeamPlayerFirstName",
                    secondTeamPlayerFirstName
                );
                req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
                req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
                // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
                // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

                // Staff info
                req.flash("firstTeamStaffId", firstTeamStaffId);
                req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
                req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

                req.flash("secondTeamStaffId", secondTeamStaffId);
                req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
                req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
                // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

                //Team starting lineups
                req.flash("firstTeamCourtPosition", firstTeamCourtPosition);
                req.flash("secondTeamCourtPosition", secondTeamCourtPosition);

                //Game dashboard information
                req.flash("setId", setId);
                req.flash("previousPointWonByTeam", previousPointWonByTeam);
                req.flash("resultInSets", resultInSets);
                req.flash("currentSetResult", currentSetResult);
                req.flash("timeoutsLeft", timeoutsLeft);
                req.flash("substitutionsLeft", substitutionsLeft);

                req.flash(
                    "success_msg",
                    `Timeout for team: ${teamName[teamIndex]}.`
                );

                res.redirect("/addnewgame/gamedashboard/" + gameAttributes[7]);
            });
        }
    } else if (formName == "replacePlayer") {
        if (
            (teamIndex == 0 && substitutionsLeft[0] == 0) ||
            (teamIndex == 1 && substitutionsLeft[1] == 0)
        ) {
            //ako brojot na zameni za toj tim e vekje 0, prati Flash poraka deka ne moze da se napravi zamena
            console.log(
                "Ne moze da se napravi zamena!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            );

            console.log(substitutionsLeft);
            console.log("Ostanati zameni za 1 tim: " + substitutionsLeft[0]);
            console.log("Ostanati zameni za 2 tim: " + substitutionsLeft[1]);
            console.log("Ostanati zameni: " + substitutionsLeft);

            req.flash("formNumber", formNumber);
            req.flash("numberOfPlayers", numberOfPlayers);

            req.flash("teamName", teamName);
            req.flash("teamId", teamId);
            req.flash("gameAttributes", gameAttributes);

            // Players info
            req.flash("firstTeamPlayerId", firstTeamPlayerId);
            req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
            req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
            req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
            req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

            req.flash("secondTeamPlayerId", secondTeamPlayerId);
            req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
            req.flash("secondTeamPlayerFirstName", secondTeamPlayerFirstName);
            req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
            req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
            // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
            // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

            // Staff info
            req.flash("firstTeamStaffId", firstTeamStaffId);
            req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
            req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

            req.flash("secondTeamStaffId", secondTeamStaffId);
            req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
            req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
            // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

            //Team starting lineups
            req.flash("firstTeamCourtPosition", firstTeamCourtPosition);
            req.flash("secondTeamCourtPosition", secondTeamCourtPosition);

            //Game dashboard information
            req.flash("setId", setId);
            req.flash("previousPointWonByTeam", previousPointWonByTeam);
            req.flash("resultInSets", resultInSets);
            req.flash("currentSetResult", currentSetResult);
            req.flash("timeoutsLeft", timeoutsLeft);
            req.flash("substitutionsLeft", substitutionsLeft);

            req.flash(
                "error_msg",
                `Can't call timeout for team: ${teamName[teamIndex]}.`
            );

            res.redirect("/addnewgame/gamedashboard/" + gameAttributes[7]);
        } else {
            //namali go brojot na Substitutions vo bazata- substitutionsLeft
            let sql = "";
            let indexOfPlayer = 0;

            if (teamIndex == 0 && substitutionsLeft[0] != 0) {
                indexOfPlayer = firstTeamCourtPosition.indexOf(playerOut[0]);
                firstTeamCourtPosition[indexOfPlayer] = playerIn[0];
                sql = `UPDATE sets SET first_team_substitutions=${--substitutionsLeft[0]} WHERE id=${setId}`;
            } else if (teamIndex == 1 && substitutionsLeft[1] != 0) {
                indexOfPlayer = secondTeamCourtPosition.indexOf(playerOut[1]);
                secondTeamCourtPosition[indexOfPlayer] = playerIn[1];
                sql = `UPDATE sets SET second_team_substitutions=${--substitutionsLeft[1]} WHERE id=${setId}`;
            }

            connection.query(sql, (err, setResult) => {
                if (err) throw err;
                console.log(setResult);
                console.log("Game id is: " + gameAttributes[7]);
                console.log(
                    "Player substitution for team: " + teamName[teamIndex]
                );

                req.flash("formNumber", formNumber);
                req.flash("numberOfPlayers", numberOfPlayers);

                req.flash("teamName", teamName);
                req.flash("teamId", teamId);
                req.flash("gameAttributes", gameAttributes);

                // Players info
                req.flash("firstTeamPlayerId", firstTeamPlayerId);
                req.flash("firstTeamPlayerJersey", firstTeamPlayerJersey);
                req.flash("firstTeamPlayerFirstName", firstTeamPlayerFirstName);
                req.flash("firstTeamPlayerLastName", firstTeamPlayerLastName);
                req.flash("firstTeamPlayerPosition", firstTeamPlayerPosition);

                req.flash("secondTeamPlayerId", secondTeamPlayerId);
                req.flash("secondTeamPlayerJersey", secondTeamPlayerJersey);
                req.flash(
                    "secondTeamPlayerFirstName",
                    secondTeamPlayerFirstName
                );
                req.flash("secondTeamPlayerLastName", secondTeamPlayerLastName);
                req.flash("secondTeamPlayerPosition", secondTeamPlayerPosition);
                // req.flash("secondTeamPlayer1BirthDate", secondTeamPlayer1BirthDate);
                // req.flash("secondTeamPlayer1Height", secondTeamPlayer1Height);

                // Staff info
                req.flash("firstTeamStaffId", firstTeamStaffId);
                req.flash("firstTeamStaffFirstName", firstTeamStaffFirstName);
                req.flash("firstTeamStaffLastName", firstTeamStaffLastName);

                req.flash("secondTeamStaffId", secondTeamStaffId);
                req.flash("secondTeamStaffFirstName", secondTeamStaffFirstName);
                req.flash("secondTeamStaffLastName", secondTeamStaffLastName);
                // req.flash("secondTeamStaffBirthDate", secondTeamStaffBirthDate);

                //Team starting lineups
                req.flash("firstTeamCourtPosition", firstTeamCourtPosition);
                req.flash("secondTeamCourtPosition", secondTeamCourtPosition);

                //Game dashboard information
                req.flash("setId", setId);
                req.flash("previousPointWonByTeam", previousPointWonByTeam);
                req.flash("resultInSets", resultInSets);
                req.flash("currentSetResult", currentSetResult);
                req.flash("timeoutsLeft", timeoutsLeft);
                req.flash("substitutionsLeft", substitutionsLeft);

                req.flash(
                    "success_msg",
                    `Substitution for team: ${teamName[teamIndex]}.`
                );

                res.redirect("/addnewgame/gamedashboard/" + gameAttributes[7]);
            });
        }
    } else if (formName == "giveCard") {
        console.log("Dodeli karton!");
    }

    console.log(
        "Random tekst!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
});

module.exports = router;
