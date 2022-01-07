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
            res.send(JSON.parse('{"message":"successfully added new movie"}'));
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    movie.deleteMany(function(err){
        if(!err){
            res.send(JSON.parse('{"message":"successfully deleted all movies"}'));
        } else {
            res.send(err);
        }
    });
});

app.route("/movies/:title")
    .get(function(req, res){
        movie.findOne({title: req.params.title}, function(err, foundMovie){
            if(!err){
                if(foundMovie){
                    res.send(foundMovie);
                }else{
                    res.send(JSON.parse('{"message":"404"}'))
                }
            }else{
                res.send(err);
            }
        });
    })
    .put(function(req, res){
        movie.findOneAndUpdate({
            title: req.params.title
        },{
            title: req.body.title,
            description: req.body.description
        },
        {
            overwrite: true
        },
        function(err, foundMovie){
            if(!err){
                if(foundMovie){
                    res.send(JSON.parse('{"message":"patched the item data"}'));
                }else{
                    res.send(JSON.parse('{"message":"404"}'));
                }
            }else{
                res.send(err);
            }
        });
    })
    .patch(function(req, res){
        movie.findOneAndUpdate({
            title: req.params.title
        },{
            $set: req.body
        },function(err, foundMovie){
            if(!err){
                if(foundMovie){
                    res.send(JSON.parse('{"message":"successfully patched"}'));
                }else{
                    res.send(JSON.parse('{"message":"404"}'))
                }
            }else{
                res.send(err)
            }
        });
    })
    .delete(function(req, res){
        movie.findOneAndRemove({
            title: req.params.title
        },
        function(err, foundMovie){
            if(!err){
                if(foundMovie){
                    res.send(JSON.parse('{"message":"deleted the item data"}'))
                }else{
                    res.send(JSON.parse('{"message":"404"}'))
                }
            }else{
                res.send(err)
            }
        });
    })
app.listen(4000, ()=> console.log("Server started on port 4000"));