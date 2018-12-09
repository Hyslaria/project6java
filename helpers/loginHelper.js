module.exports = function(options) {

    const bcrypt = require('bcryptjs');
    return {


        userChecker: function(req, res, next) {
            req.session.save();
            if (req.session && req.session.data && req.session.data.access) {
                next();
            }
            else
                res.redirect('/login');

        },
        getlogin: function(req, res) {
            res.render("login");
        },

        getNewLogin: function(req, res) {
            res.render("newlogin");
        },

        postNewLogin: function(req, res) {


            const newlogin = Object.assign({}, req.body);


            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newlogin.password, salt, function(err, hash) {

                    console.log(newlogin);
                    console.log(salt);
                    console.log(hash);

                    new options.Login({
                        login: newlogin.username,
                        password: hash,
                        salt: salt,
                        firstname: newlogin.firstname,
                        lastname: newlogin.lastname,
                        email: newlogin.email
                    }).save().then(function(savedLogin) {

                    });
                    res.redirect('/login');



                });
            });
        },

        postLogin: function(req, res) {
            // Checks if Body exists, username field exists, then attempts to attribute a match then compares the length to the known accepted
            if (req.body && req.body.username) {
                const newlogin = Object.assign({}, req.body);


                options.Login.find({ login: newlogin.username }).then(function(foundUser) {
                    console.log(newlogin);
                    console.log(foundUser);

                    bcrypt.compare(newlogin.password, foundUser[0].password, function(err, isEqual) {
                        console.log(isEqual);
                        if (isEqual) {
                            req.session.data = {
                                username: req.body.username,
                                access: true
                            };
                            res.redirect('/');
                        }
                        else {
                            res.render('login');
                        }
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.render("login", {
                        msg: "Error while processing request please try again"
                    });
                });
            }
            else {
                res.render("home");
            }


        }










    };
};
