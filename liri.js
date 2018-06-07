// --- DEPENDENCIES ---
// Read & Set env variables
require("dotenv").config();

// Import twitter package
var Twitter = require("twitter");

// Import node-spotify package
var Spotify = require("node-spotify-api");

// Import api keys
var keys = require("./keys");

// Import request package
var request = require("request");

// Import fs package for read/write
var fs = require("fs");

// Initialize the Spotify api client 
var spotify = new Spotify(keys.spotify);

//  --- FUNCTIONS ---

// Writes to log.txt
var getArtistNames = function(artist) {
    return artist.name;
  };
  
  // Function for Spotify search (If no search term is put in, The Heigh Of Callousness is auto searched)
  var getMeSpotify = function(songName) {
    if (songName === undefined) {
      songName = "The Height Of Callousness";
    }
  // This allows the user to input the name of the track they wish to search
    spotify.search(
      {
        type: "track",
        query: songName
      },
    //  If an error occurs during the search, Error occurred is logged and brings back the error
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(getArtistNames));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
    );
  };

// Function for twitter search
var getMyTweets = function() {
    var client = new Twitter(keys.twitter);
  // This pulls my screenname from the twitter api
    var params = {
      screen_name: "Baldur407"
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log(tweets[i].created_at);
          console.log("");
          console.log(tweets[i].text);
        }
      }
    });
  };

// Function for movie search. If no search term is placed, Blade Runner 2049 is auto searched and its info is populated by a console.log
var getMeMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "Blade Runner 2049";
    }
  
    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    });
  };

// Function for running the parameters in random.txt which in this case is a spotify song search for "Green Berets For Breakfast"
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      }
      else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };

// Function for determining which command is used; my-tweets, spotify-this-song, movie-this, do-what-it-says. If none of these commands are used
// LIRI will return a console.log of "LIRI doesn't know that"
var pick = function(caseData, functionData) {
    switch (caseData) {
    case "my-tweets":
      getMyTweets();
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMeMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };

// Function for taking in command line arguments 
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
// --- MAIN PROCESS --
  runThis(process.argv[2], process.argv[3]);