var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');
const Hashtag = require('../models/hashtags');

// Création d'un nouveau Tweet
router.post('/newtweet', (req, res) => {
    if(!req.body.tweet){
        res.json({ result: false, error: 'Write your tweet!!!' });
    return;
    }
    const hashtagList = req.body.tweet.match(/#[a-z]+/ig);
    const newTweet = new Tweet({
        text: req.body.tweet,
        creationDate: Date.now(),
        numberOfLikes: 0,
        hashtag: hashtagList,
        // user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},  
    });

    newTweet.save().then(() =>
        res.json({ result: true}));
});

//Récupérer la liste des tweets par hashtag
router.get('/byhash/:hashtag', (req, res) => {
    const hashtag = req.params.hashtag;
    Tweet.find({ hashtag: hashtag })
        .then(data => res.json({ result: true, tweetsWithHashtag: data }))
});

//Fait la liste des Hashtags
ro

//Suppression d'un tweet par son Id
router.delete('/:tweet', (req, res) => {
    Tweet.deleteOne({ _id: req.params.tweet})
        .then(data => res.json({ result: true}) );
});

//Ajout d'un like sur un tweet
router.post('/like/:id', (req, res) => {
    const id = req.params.id;
    Tweet.updateOne({ _id: id }, { $inc: { numberOfLikes: 1 } })
    .then(data => res.json({ result: true}))
    .catch(error => res.status(400).send(error));
});

//Retrait d'un like sur un tweet
router.post('/unlike/:id', (req, res) => {
    const id = req.params.id;
    Tweet.updateOne({ _id: id }, { $inc: { numberOfLikes: -1 } })
    .then(data => res.json({ result: true}))
    .catch(error => res.status(400).send(error));
});

//Récupère tous les tweets
router.get('/alltweets', (req, res) => {
    Tweet.find()
        .then(data => res.json({ result: true, alltweets: data }))
});

module.exports = router;