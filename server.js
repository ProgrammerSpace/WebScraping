
var cheerio = require("cheerio");
var axios = require("axios");

function Article(picture, headline, description, link) {
    this.picture = picture;
    this.headline = headline;
    this.description = description;
    this.link = link;
}

axios.get("https://www.cnet.com/topics/tech-industry/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = {};

    $(".asset").each(function (i, element) {
        var picture, h2, p, link;
        $(".assetThumb").each(function (j, element) {
            picture = $(element).find("img").attr("src");
        });
        $(".assetBody").each(function (j, element) {
            h2 = $(element).find("h2").text();
            p = $(element).find("p").text();
            link = "https://www.cnet.com" + $(element).find("a").attr("href");
        });
        var newArticle = new Article(picture, h2, p, link);
        results[i] = newArticle;
    });
});
