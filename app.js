const express = require('express');
const app = express();
const configRoutes = require('./routes');
const socket = require('./chatRoom/socket')
const session = require('express-session');
const server = require('http').createServer(app);
const io = require("socket.io")(server);

// app.use(
// 	session({
// 		name: 'cs554project',
// 		secret: "zzzsshhh",
// 		saveUninitialized: true,
// 		resave: false
// 	})
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// let redirectToSignIn = (req, res, next) => {
// 	if(!req.session.user)
// 		res.redirect('/users/signin');
// 	else
// 		next();
// };

configRoutes(app);
socket(io);

server.listen(3000, () => {
	console.log("This is the restful api, frontend will call this for service");
	console.log('Your routes will be running on http://localhost:3000');
});