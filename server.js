var express = require("express");
var exphbs = require("express-handlebars");

var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var uri = process.env.MONGODB_URI || "mongodb://localhost/webscraping";
mongoose.connect(uri);

app.get("/", function (req, res) {
    // res.redirect("/scrape");
    res.send("Welcome");
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.cnet.com/topics/tech-industry/").then(function (response) {
        var $ = cheerio.load(response.data);
        var result = {};

        $(".assetThumb").each(function (j, element) {
            result.picture = $(element).children("a").children("figure").children("img").attr("src");
            result.title = $(element).siblings(".assetBody").children("a").children("h2").text();
            result.desc = $(element).siblings(".assetBody").children("a").children("p").text();
            result.link = "https://www.cnet.com" + $(element).siblings(".assetBody").children("a").attr("href");
            console.log(result);
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log("Database Updated!");
                    articles = dbArticle;
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    });
    // res.redirect("/articles");
    res.send("Scrape complete");
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", { hbsObj: dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    console.log(req.body);
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, { $push: { "note": dbNote._id } }, { new: true });
        })
        .then(function (dbUser) {
            res.json(dbUser);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Listen on port
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});