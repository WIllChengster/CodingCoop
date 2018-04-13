const express = require('express');
const mongoose = require('mongoose');
const server = express();
const PORT = process.env.PORT || 5000;
const keys = require('./config/keys');

const router = express.Router();
const PostModel = require('./models/post');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

mongoose.connect(keys.mongoURI, function(err, res){
    if(err){
        console.log('db connection failed', err); 
    } else {
        console.log('we have liftoff with the db', res);
    }
})
            /*    deleting post  */
// mongoose.connect(keys.mongoURI, (err, db, req) => {
//     if(err) throw err;
//     let postInfo = req.data._id;
//     db.collection("posts").remove(postInfo, (err, obj)=> {
//         if (err) throw err;
//         console.log(obj.result.n + " document(s) deleted");
//     }).catch(error=> {
//         console.log(error);
//         res.json({
//             confirmation: false,
//             error: error
//         })
//     })
   
// })
server.post('/delete', (req, res) => {
    PostModel.findById(req.body.threadID, (err,data) => {
        data.remove( err => {
            if (err) throw err;

            console.log('deleted this bitch')
        } )
    } )
    
})

server.post('/addComment', (req, res) => {
    PostModel.findById(req.body.threadID , (err, data) => {
        if(err) throw err;
        
        console.log(data)



        data.comments.push( {'name': req.body.name, 'comment': req.body.comment})

        
        data.save(err=>{
            if(err) throw err;

            console.log('added comment')
        })

        res.send(data);
    } )
})

server.post('/uniqueThread', (req, res ) => {
    // console.log(req.body)
    PostModel.findById( req.body.threadID , (err, data) => {
        if(err) throw err;
        // console.log(data);
        // console.log(req.body)
        res.send(data);
        console.log(data);
    

    const threadData = PostModel.find().then( data => {
        res.send(data)
        })
    })
})

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

server.post('/newPost', (req, res, next) => {
    var postdata = new PostModel({
        title: req.body.newTitleState,
        description: req.body.newDescriptionState,
        jsbin: req.body.JsbinState,
        // comments: [{name:'hello', comment:'hello'}]
    })
    res.send(postdata);
    console.log('this is the postdata: ', postdata);
    postdata.save((err, post) => {
        if(err){
            return next(err)
        }
        
    })
})

server.get('/', function(req, res, next){
    console.log('got request: field  = '+req.query.field);
    const sortMapping = {
        newest: { timeStamp: -1},
        oldest: { timeStamp: 1},
        popular: { rating: -1},
        comments: {commentLength: -1},
        hot: {timeStamp: 1}
    }
    var sortObj;
    if(req.query.field && sortMapping[req.query.field]){
        sortObj = sortMapping[req.query.field];
    } else {
        sortObj = {};
    }
    PostModel.find().sort(sortObj).then(data=> {
        res.send({
            confirmation: true,
            results: data
        })
    }).catch(error=> {
        console.log(error);
        res.send({
            confirmation: false,
            error: error
        })
    })
})


mongoose.connect(keys.mongoURI, function(error) {
    if (error) {
        throw error;
    }

    console.log("We are connected to the mlab database");
});

/* new post schema */
/*
{
    "_id": {
        "$oid": "5acd0f13734d1d55c3198d89"
    },
    "title": "this is the title",
    "description": "this is the description",
    "file": "this is the file",
    "timeStamp": 1523387073852,
    "commentLength": 1,
    "rating": 4.5,
    "comments": [
        {
            "name": "Hannah",
            "comment": "HEEEELLLLOOOOooooOOOoooOOOO"
        }
    ]
}
*/

// AT A BASE LEVEL CREATING / INSERTING data into our collections for mongo
// var ryan = new Instructor({ name: 'Ryan', age: 24 });
// ryan.save();

// READING FROM OUR COLLECTIONS
// Instructor.find(function(err, instructors) {
//     if (err) return console.error(err);

//     console.log("These are all of our instructors", instructors);
// })
// let TestUserSchema = {
//     userName: String,
//     email: String,
//     comment: String
// }
// let TestUser = mongoose.model('TestUser', TestUserSchema);

// let testWill = new TestUser({userName: 'testWill', email: 'testWIll@gmail.com', comment: 'hello everyoasdafasdfadsfa' });
// // testWill.save();

// TestUser.find(function(err, TestUser){
//     if(err) return console.error(err);

//     console.log('these are all of the test users', TestUser);
// });

server.listen(PORT, ()=>{ console.log('server is listening to '+PORT)});



