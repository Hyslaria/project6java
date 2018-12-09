module.exports = function(options) {
    const passerRating = function(att, comp, yds, td, int) {
        return ((8.4 * yds) + (330 * td) + (100 * comp) - (200 * int)) / att;
    };

    return {




        home: function(req, res) {
            options.Player.find({ age: { $gt: 0 } }).then(function(foundPlayers) {

                console.log(foundPlayers);

                foundPlayers.forEach(function(player) {
                    let completions = 0;
                    let attempts = 0;
                    let yards = 0;
                    let touchdown = 0;
                    let interceptions = 0;
                    player.games.forEach(function(game) {
                        completions += game.completions;
                        attempts += game.attempts;
                        yards += game.yards;
                        touchdown += game.touchdowns;
                        interceptions += game.interceptions;

                    });
                    player.passerRating = passerRating(attempts, completions, yards, touchdown, interceptions);
                });

                res.render('home', { player: foundPlayers });
            });
        },

        getaddplayer: function(req, res) {
            res.render('addPlayer');
        },

        postaddplayer: function(req, res) {
            const newPlayer = Object.assign({}, req.body);
            console.log(newPlayer);

            let parsed = parseInt(req.body.age, 10);
            if (isNaN(parsed)) {
                parsed = 0;
                res.redirect('/addplayer');
            }
            else {

                options.Player({
                    name: newPlayer.name,
                    age: parsed,
                    hometown: newPlayer.hometown,
                    school: newPlayer.school,
                }).save().then(function(newPlayer) {

                });



                res.redirect('/');
            }
        },

        getplayer: function(req, res) {

            options.Player.findOne({ _id: req.params.id }).then(function(foundPlayers) {
                let player = foundPlayers;
                let completions = 0;
                let attempts = 0;
                let yards = 0;
                let touchdown = 0;
                let interceptions = 0;

                for (let i = 0; i < player.games.length; i++) {
                    completions += player.games[i].completions;
                    attempts += player.games[i].attempts;
                    yards += player.games[i].yards;
                    touchdown += player.games[i].touchdowns;
                    interceptions += player.games[i].interceptions;

                }
                console.log(player);
                res.render('player', {
                    id: player._id,
                    name: player.name,
                    age: player.age,
                    hometown: player.hometown,
                    school: player.school,
                    completions: completions,
                    attempts: attempts,
                    yards: yards,
                    touchdown: touchdown,
                    interceptions: interceptions,
                    games: player.games
                });
            });
        },

        getplayeredit: function(req, res) {
            options.Player.findOne({ _id: req.params.id }).then(function(foundPlayers) {
                let player = foundPlayers;

                console.log(player);
                res.render('editplayer', { player: player });
            });
        },

        postplayeredit: function(req, res) {
            if (req.body && req.body.name && req.body.age && req.body.hometown && req.body.school) {
                let url = '/player/' + req.params.id;
                let parsed = parseInt(req.body.age, 10);
                if (isNaN(parsed)) {
                    res.redirect(url);
                }
                else {


                    options.Player.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, age: parsed, hometown: req.body.hometown, school: req.body.school },
                        function(err, model) {
                            if (err) {
                                res.redirect(url);
                            }
                            else {
                                res.redirect(url);
                            }
                        });
                }
            }
        },
        postplayerdelete: function(req, res) {
            options.Player.findOneAndDelete({ _id: req.params.id },
                function(err, model) {
                    if (err) {
                        res.redirect('/');
                    }
                    else {
                        res.redirect('/');
                    }
                });
        },

        getgameadd: function(req, res) {
            options.Player.findOne({ _id: req.params.id }).then(function(foundPlayers) {

                console.log(foundPlayers);
                res.render('addgame', { player: foundPlayers });
            });
        },

        postgameadd: function(req, res) {
            // Go get the event
            options.Player.findOne({ _id: req.params.id }).then(function(foundPlayers) {
                let url = '/player/' + req.params.id;

                // Modify the event
                foundPlayers.games.push(req.body);

                // Save the event
                foundPlayers.save().then(function(savedEvent) {
                    res.redirect(url);
                }).catch(function(err) {
                    res.json({
                        status: "error",
                        message: err.message
                    });
                });

            }).catch(function(err) {
                res.json({
                    status: "error",
                    message: err.message
                });
            });
        },

        getgame: function(req, res) {

            options.Player.findOne({ _id: req.params.id_p }).then(function(foundPlayers) {
                console.log("getting Game");
                console.log(foundPlayers);

                // Modify the event
                let game = foundPlayers.games.find(function(game) {
                    if (game._id == req.params.id_g)
                        return game;
                });

                if (!game) {
                    res.json({
                        status: "error",
                        message: "error"
                    });
                }


                console.log(game);

                res.render('game', { game: game, player: req.params.id_p });


            }).catch(function(err) {
                res.json({
                    status: "error",
                    message: err.message
                });
            });

        },

        getgameedit: function(req, res) {

            options.Player.findOne({ _id: req.params.id_p }).then(function(foundPlayers) {
                console.log("getting Game");
                console.log(foundPlayers);

                // Modify the event
                let game = foundPlayers.games.find(function(game) {
                    if (game._id == req.params.id_g)
                        return game;
                });

                if (!game) {
                    res.json({
                        status: "error",
                        message: "error"
                    });
                }
                console.log(game);

                res.render('editgame', { game: game, player: req.params.id_p });


            }).catch(function(err) {
                res.json({
                    status: "error",
                    message: err.message
                });
            });



        },

        postgameedit: function(req, res) {
            if (req.body && req.body.opponet && req.body.date && req.body.date && req.body.completions && req.body.attempts && req.body.attempts && req.body.yards && req.body.touchdowns && req.body.interceptions) {
                options.Player.findOne({ _id: req.params.id_p }).then(function(foundPlayers) {
                    console.log("getting Game");
                    console.log(foundPlayers);
                    let url = '/player/' + req.params.id_p;
                    // Modify the event
                    let game = foundPlayers.games.findIndex(function(game) {
                        if (game._id == req.params.id_g)
                            return game;
                    });

                    foundPlayers.games[game] = req.body;
                    console.log(game);
                    console.log(foundPlayers.games);

                    options.Player.findOneAndUpdate({ _id: req.params.id_p }, { games: foundPlayers.games }).then(function() {
                        res.redirect(url);
                    });


                });
            }
            else {
                res.json({
                    status: "error",
                    message: "error"
                });
            }
        },

        postgamedelete: function(req, res) {
            if (req.body) {
                options.Player.findOne({ _id: req.params.id_p }).then(function(foundPlayers) {
                    console.log("getting Game");
                    console.log(foundPlayers);
                    let url = '/player/' + req.params.id_p;
                    // Modify the event
                    let game = foundPlayers.games.findIndex(function(game) {
                        if (game._id == req.params.id_g)
                            return game;
                    });

                    foundPlayers.games.splice(game, 1);
                    console.log(game);
                    console.log(foundPlayers.games);

                    options.Player.findOneAndUpdate({ _id: req.params.id_p }, { games: foundPlayers.games }).then(function() {
                        res.redirect(url);
                    });

                });
            }
            else {
                res.json({
                    status: "error",
                    message: "error"
                });
            }
        }
    };
};
