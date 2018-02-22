/**Requiring the needed modules and config file**/
const express = require('express');
const Twit = require('twit');
const moment = require('moment');
const bodyParser = require('body-parser');
const config = require('./config.js');


/**creating the app and set up**/
const app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

/**Setting up local host***/
app.listen(3000);

/**twitter API initialization**/
var twitterAPI = new Twit({
  consumer_key:         'irCVAXee71gel6oNzccSHQXXj',
  consumer_secret:      'ljmgFkc3DrQ73ODFLFejT0CPfosK1Mkhz9309zQXpMl7XeVCRT',
  access_token:         '754198190295961601-zxpVefaGihKnFRnqgnXQIVldcFsMPUB',
  access_token_secret:  '9pnzC2HzwTkx6rvoGX9hY7zYOo8OR6uSGlV3efoRUFn11'
});


/**Twitter API calls**/

//Get the 5 most recent tweets
app.use((req, res, next) => {
  twitterAPI.get('statuses/user_timeline', { count: 5 }, function (err, data, response) {
    req.timeline = data;
    next();
  });
});

//Get the 5 most recent friends
app.use((req, res, next) => {
  twitterAPI.get('friends/list', { count: 5 }, function (err, data, response) {
    req.friends = data;
    next();
  });
});

//Get the 5 most recent messages received
app.use((req, res, next) => {
  twitterAPI.get('direct_messages', { count: 5 }, function (err, data, response) {
    req.messages = data;
    next();
  });
});

//Verify and get user info
app.use((req, res, next) => {
  twitterAPI.get('account/verify_credentials', { skip_status: true }, function(err, data, response) {
    req.user = data;
    console.log(data);
    next();
  });
});

/***Root GET route**/
app.get('/', (req, res) => {
  const user = req.user;
  const timeline = req.timeline;
  const friends = req.friends;
  const messages = req.messages;
  const messages_sent = req.messages_sent;
  const background = req.background;
  res.render('layout', { user, timeline, friends, messages, background, moment });
});


app.post('/', (req, res) => {
  twitterAPI.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
    console.log('You tweeted!');
  });
  res.redirect('/');
});

app.use((req, res, next) => {
  const err = new Error("Hmm... something went wrong.");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.render('error_page', err);
});