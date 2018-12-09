module.exports = function(options) {

    const passerRating = function(att, comp, yds, td, int) {
        return ((8.4 * yds) + (330 * td) + (100 * comp) - (200 * int)) / att;
    };
    return {




        postaddplayer: function(req, res) {
            if (req.body && req.body.name && req.body.age && req.body.hometown && req.body.school) {
                const newPlayer = Object.assign({}, req.body);

                let parsed = parseInt(req.body.age, 10);
                if (isNaN(parsed)) {
                    parsed = 0;
                    res.json({
                        status: "error",
                        message: "Incorrect Format"
                    });
                }
                else {

                    options.Player({
                        name: newPlayer.name,
                        age: parsed,
                        hometown: newPlayer.hometown,
                        school: newPlayer.school,
                    }).save().then(function(newPlayer) {
                        res.json({
                            status: "Suscess",
                            message: newPlayer
                        });

                    });



                }
            }
            else {
                res.json({
                    status: "error",
                    message: "Incorrect Format"
                });

            }
        },


        postplayeredit: function(req, res) {
            if (req.body && req.body.name && req.body.age && req.body.hometown && req.body.school) {
                let parsed = parseInt(req.body.age, 10);
                if (isNaN(parsed)) {
                    res.json({
                        status: "error",
                        message: "Incorrect Format"
                    });
                }
                else {


                    options.Player.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, age: parsed, hometown: req.body.hometown, school: req.body.school }, { new: true },
                        function(err, model) {
                            if (err) {
                                res.json({
                                    status: "error",
                                    message: "Incorrect Format"
                                });
                            }
                            else {
                                res.json({
                                    status: "suscess",
                                    message: model
                                });
                            }
                        });
                }
            }
        },
        postplayerdelete: function(req, res) {
            options.Player.findOneAndDelete({ _id: req.params.id },
                function(err, model) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: "Incorrect Format"
                        });
                    }
                    else {
                        res.json({
                            status: "suscess",
                            message: model
                        });
                    }
                });
        },


        postgameadd: function(req, res) {
            // Go get the event
            options.Player.findOne({ _id: req.params.id }).then(function(foundPlayers) {

                // Modify the event
                foundPlayers.games.push(req.body);

                // Save the event
                foundPlayers.save().then(function(savedGame) {
                    res.json({
                        status: "suscess",
                        message: savedGame
                    });
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


        postgameedit: function(req, res) {
            if (req.body && req.body.opponet && req.body.date && req.body.date && req.body.completions && req.body.attempts && req.body.attempts && req.body.yards && req.body.touchdowns && req.body.interceptions) {
                options.Player.findOne({ _id: req.params.id_p }).then(function(foundPlayers) {
                    // Modify the event
                    let game = foundPlayers.games.findIndex(function(game) {
                        if (game._id == req.params.id_g)
                            return game;
                    });

                    foundPlayers.games[game] = req.body;

                    options.Player.findOneAndUpdate({ _id: req.params.id_p }, { games: foundPlayers.games }).then(function(updatedGame) {
                        res.json({
                            status: "suscess",
                            message: updatedGame
                        });
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
                    // Modify the event
                    let game = foundPlayers.games.findIndex(function(game) {
                        if (game._id == req.params.id_g)
                            return game;
                    });

                    foundPlayers.games.splice(game, 1);

                    options.Player.findOneAndUpdate({ _id: req.params.id_p }, { games: foundPlayers.games }).then(function(updatedGame) {
                        res.json({
                            status: "suscess",
                            message: updatedGame
                        });
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
