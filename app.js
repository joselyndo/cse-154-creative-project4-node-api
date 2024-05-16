/**
 * Header comment
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

app.get("/random-flowers/:amount", function(req, res) {

});

app.get("/flower/:flowerName", async function(req, res) {
  try {
    let flowersInfo = await fs.readFile("data/flower-info.json", "utf-8");
    flowersInfo = JSON.parse(flowersInfo);
    let specificFlowerInfo = flowersInfo[req.params.flowerName];
    res.json(specificFlowerInfo);
  } catch (error) {
    res.type("text");
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to find file with information for:" + req.params.flowerName);
    } else {
      res.status(500).send("An error has occured on the server");
    }
  }
});

app.post("/recommendation/add", async function(req, res) {
  try {
    let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
    let yesNoCount = processRecText(recommendationText);
    // TODO
  } catch (error) {
    res.type("text");
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to find file with requested information");
    } else {
      res.status(500).send("An error has occured on the server");
    }
  }
});

app.get("/recommendation/get-percentage", async function(req, res) {
  try {
    let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
    let yesNoCount = processRecText(recommendationText);
    let recommendPercentage = Math.floor(yesNoCount[0] / (yesNoCount[0] + yesNoCount[1]));
    res.type("text").send(recommendPercentage.toString());
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to find file with requested information");
    } else {
      res.status(500).send("An error has occured on the server");
    }
  }
});

function processRecText(text) {
  let splitByOption = text.split("\n");
  let splitByOptionAndAmount = splitByOption.split(":");
  let yesNoCount = [splitByOptionAndAmount[0][1], splitByOptionAndAmount[1][1]];
  return yesNoCount;
}

// API: get list of random flowers of length 5 -> change
// API: get info for a specific flower -> dblclick l/r buttons
// API: send if recommend or not -> click

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);