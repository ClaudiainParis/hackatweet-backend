var express = require('express');
var router = express.Router();

require('../models/connection');
// const User = require('../models/users');
const Tweet = require('../models/tweets');

router.post('/newtweet', (req, res) => {
    if(!req.body.tweet){
        res.json({ result: false, error: 'Write your tweet!!!' });
    return;
    }
      
            const newTweet = new Tweet({
                text: req.body.tweet,
                creationDate: Date.now(),
                numberOfLikes: 0,
                // user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
                // hashtag: { type: mongoose.Schema.Types.ObjectId, ref: 'hashtags'}
            });
      
            newTweet.save().then(() =>
              res.json({ result: true}));
       
      });




module.exports = router;