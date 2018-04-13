var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    Twitter         = require('twitter');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var twit = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get("/", function(req, res){
    res.render("index");
});

app.post("/", function(req, res){
    var handle = req.body.handle;
    if(handle.charAt(0)=='@')
        handle = handle.substring(1);
    var params = {screen_name: handle};
    twit.get('users/lookup', params, function(error, users, response) {
      if (!error) {
        var followers = users[0].followers_count,
            stats     = users[0].statuses_count;
            var latestTweets = require('latest-tweets')
            latestTweets(handle, function (err, tweets) {
              if(tweets.length>0)
                var latest = tweets[0].content;
              else
                var latest = "";
              var info   = { followers : followers, stats : stats, latest : latest };
              res.render("result", {info : info});
            });
            
      } else {
          res.render("invalid");
      }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started.");
});

