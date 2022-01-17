require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const path = require('path');
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_TOKEN);

// mongoose.connect("mongodb://localhost:27017/FightClubsDB");

const quoteSchema = {
    sno: Number,
    quote: String,
    author: String
};

const Quote = mongoose.model("Quote", quoteSchema);

// Finding the total number of data entries
let total = 1;
Quote.countDocuments((err, count) => {
    if(err){
        console.log(err);
    } else {
        console.log(count)
        total = count;
    }
});

// home rouote

app.route("/")
    .get((req, res) => {
        let randomQuote = Math.floor(Math.random()*total)+1;

        Quote.findOne({
            sno: randomQuote
        }, (err, foundQuote) => {
            if (!err) {
                if (foundQuote) {
                    // getting the comment
                    comment = foundQuote.quote;

                    // // converting it to JSON string object
                    // json_return_string = `{"quote":"${comment}"}`;

                    // // converting it to string
                    // return_string = json_return_string.toString();

                    // res.send(JSON.parse(json_return_string))
                    res.send(`<center><h2>${comment}</h2></center>`)
                } else {
                    res.send(JSON.parse('{"error":"no quotes found"}'));
                }
            } else {
                res.send(err);
            }
        });

        // res.sendFile(path.join(__dirname, '/index.html'));
    });


app.route("/FightClub")

.get(function(req, res){
    Quote.find(function(err, foundQuotes){
        if(!err){
            if (foundQuotes) {
                res.send(foundQuotes);
            } else {
                res.send('{"error":"empty API"}');
            }
        } else {
            res.send(err);
        }
    });
})
;




/* ********************************************** */

// .post(function(req, res){
//     const newQuote = new Quote({
//         sno: req.body.sno,
//         quote: req.body.quote,
//         author: req.body.author
//     });
//     newQuote.save(function(err){
//         if(!err){
//             res.send(JSON.parse('{"message":"successfully added new quote."}'));
//         } else {
//             res.send(err);
//         }
//     });
// })

// .delete(function(req, res){
//     Quote.deleteMany(function(err){
//         if(!err){
//             res.send(JSON.parse('{"message":"successfully deleted all quotes."}'));
//         } else {
//             res.send(err);
//         }
//     });
// });

/* ********************************************** */









app.route("/FightClub/:sno")
    .get(function(req, res){
        Quote.findOne({sno: req.params.sno}, function(err, foundQuote){
            if(!err){
                if(foundQuote){
                    res.send(foundQuote);
                }else{
                    res.send(JSON.parse('{"message":"404"}'))
                }
            }else{
                res.send(err);
            }
        });
    })
;









/* ********************************************** */

    // .put(function(req, res){
    //     Quote.findOneAndUpdate(
    //     {
    //         sno: Number(req.params.sno)
    //     },
    //     {
    //         sno: req.body.sno,
    //         quote: req.body.quote,
    //         author: req.body.author
    //     },
    //     {
    //         overwrite: true
    //     },
    //     function(err, foundQuote){
    //         if(!err){
    //             if(foundQuote){
    //                 res.send(JSON.parse('{"message":"patched the item data"}'));
    //             }else{
    //                 res.send(JSON.parse('{"message":"404"}'));
    //             }
    //         }else{
    //             res.send(err);
    //         }
    //     });
    // })
    // .patch(function(req, res){
    //     Quote.findOneAndUpdate({
    //         sno: req.params.sno
    //     },{
    //         $set: req.body
    //     },function(err, foundQuote){
    //         if(!err){
    //             if(foundQuote){
    //                 res.send(JSON.parse('{"message":"successfully patched"}'));
    //             }else{
    //                 res.send(JSON.parse('{"message":"404"}'))
    //             }
    //         }else{
    //             res.send(err)
    //         }
    //     });
    // })
    // .delete(function(req, res){
    //     Quote.findOneAndRemove(
    //     {
    //         sno: req.params.sno
    //     },
    //     function(err, foundQuote){
    //         if(!err){
    //             if(foundQuote){
    //                 res.send(JSON.parse('{"message":"deleted the item data"}'))
    //             }else{
    //                 res.send(JSON.parse('{"message":"404"}'))
    //             }
    //         }else{
    //             res.send(err)
    //         }
    //     });
    // });

/* ********************************************** */


// app.listen(process.env.PORT)




app.listen(PORT , ()=> console.log("Server started on port 4000"));

// var port_number = server.listen(process.env.PORT || 3000);
// app.listen(port_number);