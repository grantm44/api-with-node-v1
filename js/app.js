/*
config.js file format 
var twit = require('twit'); 

var exports = module.exports = {};
exports.T = new twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
});*/

var express = require('express');
var app = express();
var pug = require('pug');
var twit = require('twit');
var view = require('./config.js');
var moment = require('moment');

var options = {count : 5}
var friend = {};
var friends = {};
var user ={};
var tweets = {}; 
var dm = {};
app.set('view engine', 'pug');
app.set('views', './template');
app.set('view options', {
  layout: false
});

app.use('/static', express.static('./public'));



view.T.get('account/verify_credentials', {skip_status:true})
.catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function(result){
    user = result.data;
})

//get last 5 tweets
view.T.get('statuses/user_timeline', options)
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function(result){
      //text of tweet, likes, retweet-count, time
    tweets = result.data;
    tweets = timeStamp(tweets);
  })

view.T.get('direct_messages', options)
  .catch(function(err){
    console.log('caught error', err.stack)
  })
  .then(function(result){
      //text of tweet, likes, retweet-count, time
    dm = result.data;
    dm = timeStamp(dm);
    console.log(dm);
  })


view.T.get('friends/list', options, function(err, data, response){
  friends = data;
})
.then(function(result){
  
})

app.get('/', function(req, res){
    res.render('interface',
      {
        friends: friends, //friend screenname, name, img
        user: user, //name, pic
        tweets: tweets,
        dm : dm 
      });
  })
//5 most recent tweets, 5 recent friends, 5 recent PM's
// direct_messages, friends/list

function timeStamp(obj){
  var format = 'ddd MMM DD HH:mm:ss Z yyyy';
  for(var i = 0; i<obj.length; i++){
    obj[i].created_at = (moment(obj[i].created_at, format).format('lll'));
  }
  return obj;
}
app.listen(3000);