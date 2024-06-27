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
    const hashtagListNoHashtag = hashtagList.map((hashtag)=> hashtag.replace("#", ""))

    User.findOne({token : req.body.token})
    .then((data)=> {
        const newTweet = new Tweet({
            text: req.body.tweet,
            creationDate: Date.now(),
            numberOfLikes: 0,
            user: data._id,
            hashtag: hashtagList,
           
        });
        newTweet.save().then(() =>
            Tweet.find()
            .populate('user')
            .then((data) =>
            res.json({ result: true, tweet: data})))
      

    })

});

//Récupérer la liste des tweets par hashtag
router.get('/byhash/:hashtag', (req, res) => {
    const hashtag = req.params.hashtag;
    Tweet.find({ hashtag: hashtag })
        .then(data => res.json({ tweetsWithHashtag: data }))
});

router.get('/tweetsbyuser', (req, res) => {
    Tweet.find({ token :'srKROxtbj7A4aiCp5lnwUz5SCJdJSJXD' })
    .populate('users')
        .then(data => console.log(data))
});

//Fait la liste des Hashtags
router.get('/hashtags', (req, res) => {
    Tweet.find({ })
        .then(data => {
                hashtagList = data
                    .map(tweet => tweet.hashtag)
                    .flat()
                    .filter(e => e)
                    .reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {})                  
                orderedHashtagList = Object.keys(hashtagList)
                    .sort()
                    .reduce(
                    (obj, key) => { 
                        obj[key] = hashtagList[key]; 
                        return obj;
                        }, 
                        {}
                    );
            res.json({ hashtags: orderedHashtagList })
        })
});

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
    Tweet.find().sort({date:-1})
        .then(data => {
            res.json({ alltweets: data })
        });
});

module.exports = router;