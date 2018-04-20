const router = require('express').Router();
const PostModel = require('../models/post');




router.post('/comment/add', (req, res) => {
    PostModel.findById(req.body.threadID , (err, data) => {
        if(err) throw err;
        data.comments.push( {
            name: req.body.user.name, 
            'comment': req.body.comment,
            'rating': 0,
            commentRatedUsers: []
        });
        data.save(err=>{
            if(err) throw err;
        });
        res.send(data);
    } )
})

router.post('/comment/vote', (req,res) => {
    PostModel.findById(req.body.threadID , (err,data)=> {
        const target = data.comments.id(req.body.commentData._id);
        let match = false;
        let matchId;
        for (let i =0; i<target.commentRatedUsers.length; i++){
            if (target.commentRatedUsers[i].login === req.body.user.login){
                match=true
                matchId = target.commentRatedUsers[i]._id
            }
        }
        if(!match){
            target.commentRatedUsers.push({
                name: req.body.user.name,
                login: req.body.user.login,
                vote: req.body.vote
            })
            if (req.body.vote==='up'){
                target.rating +=1;
            } else {
                target.rating -=1;
            }  
        } else {
            if(target.commentRatedUsers.id(matchId).vote==='up'){
                if(req.body.vote ==='up'){
                    target.commentRatedUsers.id(matchId).remove() 
                } else {
                    target.commentRatedUsers.id(matchId).remove() 
                    target.commentRatedUsers.push({
                        name: req.body.user.name,
                        login: req.body.user.login,
                        vote: 'down'
                    })
                }
            } else { 
                if(req.body.vote !=='up'){
                    target.commentRatedUsers.id(matchId).remove()
                } else {
                    target.commentRatedUsers.id(matchId).remove() 
                    target.commentRatedUsers.push({
                        name: req.body.user.name,
                        login: req.body.user.login,
                        vote: 'up'
                    })
                }
            }
        }
        console.log(target.commentRatedUsers)
        let upCount = null;
        let downCount = null;
        for( let i =0; i<target.commentRatedUsers.length; i++){
            if( target.commentRatedUsers[i].vote ==='up' )upCount ++
            else downCount ++
        }
        target.rating = upCount - downCount

        data.save(err=>{
            // if(err) throw err;
        })
        res.send(data.comments.id(req.body.commentData._id));
    } )
    
    }
)

module.exports=router