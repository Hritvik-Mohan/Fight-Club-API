require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_TOKEN);

const movieSchema = {
    title: String,
    description: String
};

const movie = mongoose.model("Movie", movieSchema);

app.route("/movies")

.get(function(req, res){
    movie.find(function(err, foundMovies){
        if(!err){
            res.send(foundMovies);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newMovie = new movie({
        title: req.body.title,
        description: req.body.description
    });
    newMovie.save(function(err){
        if(!err){
            res.send("Successfully added a new movie.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    movie.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all movies.");
        } else {
            res.send(err);
        }
    });
});

app.listen(4000, ()=> console.log("Server started on port 4000"));