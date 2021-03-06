const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
const server = express();
const PORT = process.env.PORT || 5000;
const keys = require('./config/keys');
const passport = require('passport');
const session = require('express-session');


const passportConfig = require('./config/passport-setup');
const router = express.Router();
const commentRoutes = require('./routes/commentRoutes')
const postRoute = require('./routes/posts')
const passportRoute = require('./routes/passportRoute')
const profileRoute = require('./routes/profileRoute')


server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


server.use(session({ secret: keys.session.cookieKey }));
server.use(passport.initialize());
server.use(passport.session());


server.use(express.json());
server.use(express.urlencoded({ extended: false }));


// using routes imported from route directory
server.use(commentRoutes);
server.use(postRoute);
server.use('/auth',passportRoute);
server.use('/profile', profileRoute);


server.use(express.static(resolve(__dirname, '..', 'dist')));
server.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '..', 'dist', 'index.html'));
});


mongoose.connect(keys.mongoURI, function(err, res){
    if(err){
        console.log('db connection failed', err); 
    } else {
        console.log('we have liftoff with the db');
    }
})

mongoose.connect(keys.mongoURI, function(error) {
    if (error) {
        throw error;
    }

    console.log("We are connected to the mlab database");
});

server.listen(PORT, ()=>{ console.log('server is listening to '+PORT)});
