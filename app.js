const express = require('express');
const app = express();
const configRoutes = require('./routes');
const socket = require('./chatRoom/socket')
const session = require('express-session');
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        name: 'cs554project',
        secret: "zzzsshhh",
        saveUninitialized: true,
        resave: false
    })
);

//seems this does not work yet
app.use((req, res, next) => {
    console.log(req.session.user);
    next();
})


// let redirectToSignIn = (req, res, next) => {
// 	if(!req.session.user)
// 		res.redirect('/users/signin');
// 	else
// 		next();
// };

configRoutes(app);
socket(io);

server.listen(4000, () => {
    console.log("This is the restful api, frontend will call this for service");
    console.log('Your routes will be running on http://localhost:4000');
});