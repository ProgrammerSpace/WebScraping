var express = require("express");
var exphbs = require("express-handlebars");

var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webscraping", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("https://www.cnet.com/topics/tech-industry/").then(function (response) {
        var $ = cheerio.load(response.data);
        var result = {};

        $(".asset").each(function (i, element) {
            $(".assetBody").each(function (j, element) {
                result.title = $(element).find("h2").text();
                result.desc = $(element).find("p").text();
                result.link = "https://www.cnet.com" + $(element).find("a").attr("href");
            });
            $(".assetThumb").each(function (j, element) {
                result.picture = $(element).find("img").attr("src");
            });
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// Listen on port
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});