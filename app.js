const express = require('express');
const bodyParser = require("body-parser");
const credentials = require("./credentials.js");




let app = express();

// set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require("express-session")({
	resave: false,
	saveUnitialized: false,
	secret: credentials.cookieSecret,
	cookie: { secure: false }
}));

//sets up db objects
const options = { server: { socketOption: { keepAlive: 1 } } };

let mongooseLogon = require("mongoose");
let dbLogin = mongooseLogon.createConnection('mongodb://dbuser:dbpassword1@ds127644.mlab.com:27644/project6_login', options);
let Login = require('./models/login.js')(dbLogin);

let mongoosePlayer = require("mongoose");
let dbPlayer = mongoosePlayer.createConnection('mongodb://dbuser:dbpassword1@ds227664.mlab.com:27664/project6_qb_data', options);
let Player = require('./models/player.js')(dbPlayer);

dbLogin.on('error', console.error.bind(console, 'connection error:'));
dbLogin.once('open', function() { console.log("db1 connected") });

dbPlayer.on('error', console.error.bind(console, 'connection error:'));
dbPlayer.once('open', function() { console.log("db2 connected") });

//calls helpers
let loginHelpers = require("./helpers/loginHelper.js")({ Login: Login });
let playerHelper = require("./helpers/playerHelper.js")({ Player: Player });
let apiHelper = require("./helpers/apiHelper.js")({ Player: Player });


// Login screen should display the form
app.get('/login', loginHelpers.getlogin);
app.get('/newlogin', loginHelpers.getNewLogin);
app.post('/newlogin', loginHelpers.postLogin);
app.post('/login', loginHelpers.postLogin);

//Home 
app.get('/', loginHelpers.userChecker, playerHelper.home);

//player Specific Page
app.get('/addplayer', loginHelpers.userChecker, playerHelper.getaddplayer);
app.post('/addplayer', loginHelpers.userChecker, playerHelper.postaddplayer);
app.get('/player/:id', loginHelpers.userChecker, playerHelper.getplayer);
app.get('/player/:id/edit', loginHelpers.userChecker, playerHelper.getplayeredit);
app.post('/player/:id/edit', loginHelpers.userChecker, playerHelper.postplayeredit);
app.post('/player/:id/delete', loginHelpers.userChecker, playerHelper.postplayerdelete);

//game Specific Page
app.get('/player/:id/game/add', loginHelpers.userChecker, playerHelper.getgameadd);
app.post('/player/:id/game/add', loginHelpers.userChecker, playerHelper.postgameadd);
app.get('/player/:id_p/game/:id_g', loginHelpers.userChecker, playerHelper.getgame);
app.get('/player/:id_p/game/:id_g/edit', loginHelpers.userChecker, playerHelper.getgameedit);
app.post('/player/:id_p/game/:id_g/edit', loginHelpers.userChecker, playerHelper.postgameedit);
app.post('/player/:id_p/game/:id_g/delete', loginHelpers.userChecker, playerHelper.postgamedelete);


//api specifics
app.post('/api/addplayer', apiHelper.postaddplayer);
app.post('/api/player/:id/edit', apiHelper.postplayeredit);
app.post('/api/player/:id/delete', apiHelper.postplayerdelete);
app.post('/api/player/:id/game/add', apiHelper.postgameadd);
app.post('/api/player/:id_p/game/:id_g/edit', apiHelper.postgameedit);
app.post('/api/player/:id_p/game/:id_g/delete', apiHelper.postgamedelete);

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});
