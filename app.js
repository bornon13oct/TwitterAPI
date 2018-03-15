var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    Twitter         = require('twitter');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var twit = new Twitter({
  consumer_key: '8WupYFgGq1sjztH6AN2jQdYDb',
  consumer_secret: 'f5MPa3lGFenoacyTGmPByH1zSpaV8kFilT69TFhwHVEwGNeskt',
  access_token_key: '753772479600955392-sWugKE5NZrUzg0SHShOytIzALXRozdK',
  access_token_secret: 'Gx5yhbZnDt2jUYVca8LvdcRPa0hCiuXNS6kcD7Ugue7Q9'
});

app.get("/", function(req, res){
    res.render("index");
});

app.post("/", function(req, res){
    var handle = req.body.handle;
    if(handle.charAt(0)=='@')
        handle = handle.substring(1);
    console.log(handle);
    var params = {screen_name: handle};
    twit.get('users/lookup', params, function(error, users, response) {
      if (!error) {
        var followers = users[0].followers_count,
            stats     = users[0].statuses_count;
            var latestTweets = require('latest-tweets')
            latestTweets(handle, function (err, tweets) {
              var latest = tweets[0].content;
              var info   = { followers : followers, stats : stats, latest : latest };
              res.render("result", {info : info});
            });
      }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started.");
});

