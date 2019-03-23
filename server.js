// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "newsdb";
var collections = ["news"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// TODO: Whenever a user visits your site, the app should scrape stories from a news
// outlet of your choice and display them for the user. Each scraped article should be
// saved to your application database. At a minimum, the app should scrape and display the following information for each article:


// Headline - the title of the article
//Summary - a short summary of the article
//URL - the url to the original article



//Users should also be able to leave comments on the articles displayed and revisit them later.The comments should be saved to the database as well and associated with their articles.Users should also be able to delete comments left on articles.All stored comments should be visible to every user.

/* -/-/-/-/-/-/-/-/-/-/-/-/- */
// Making a request via axios 
app.get("/", function (req, res) {
    axios.get("https://www.npr.org/sections/news/").then(function (response) {
        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        console.log("Request complete");
        // empty arrays to save the data that we'll scrape
        var titles = [];
        var summaries = [];
        var links = [];


        $("h2.title").each(function (i, element) {
            var title = $(element).text();
            var link = $(element).children().attr("href");

            titles.push(title);
            links.push(link);
        });
        $("p.teaser").each(function (i, element) {
            var summary = $(element).text();
            summaries.push(summary);
        });
        // Log the results once you've looped through each of the elements found with cheerio
        // console.log(titles.length + "" + summaries.length +""+ links.length)

        var results = [];
        for (var i = 0; i < titles.length; i++) {
            results.push({
                title: titles[i],
                summary: summaries[i],
                link: links[i]
            });
            //add to db
            db.news.insert({
                "url": links[i],
                "title": titles[i],
                "summary": summaries[i]
            })
            console.log(results);
        }
        db.news.find({}, function (error, found) {
            // Log any errors if the server encounters one
            if (error) {
                console.log(error);
            }
            // Otherwise, send the result of this query to the browser
            else {
                res.json(found);
            }
        });
    });
});
// Listen on port 3000
app.listen(3001, function () {
    console.log("App running on port 3000!");
});
