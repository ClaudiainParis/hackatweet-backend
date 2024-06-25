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
    const tweetHashtag = req.body.tweet.match(/#[a-z]+/ig);
    
            const newTweet = new Tweet({
                text: req.body.tweet,
                creationDate: Date.now(),
                numberOfLikes: 0,
                // user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
                hashtag: tweetHashtag,
            });
      
            newTweet.save().then(() =>
              res.json({ result: true}));
       
      });

     //Suppression d'un tweet par son Id
router.delete('/:tweet', (req, res) => {
    Tweet.deleteOne({ _id: req.params.tweet})
        .then(data => res.json({ result: true}) );
});

//Ajout d'un like sur un tweet
router.put('/like/:id', (req, res) => {
    Tweet.updateOne({ _id: req.params.id, $inc: {numberOfLikes: +1}} )
        .then(data => res.json({ result: true}))
});

// unlike a tweet
router.put('/unlike/:id', (req, res) => {
    Tweet.updateOne({ _id: req.params.id, $inc: {numberOfLikes: -1}} )
        .then(data => res.json({ result: true}))
});

//Récupère un tweet par son _Id
router.get('/:id', (req, res) => {
    Tweet.find({ _id: req.params.id })
        .then(data => res.json({ result: true, tweets: data}))
});

// show all tweets
router.get('/alltweets', (req, res) => {
    Tweet.find()
    .then(data => res.json({ result: true, data }))
});
    


module.exports = router;