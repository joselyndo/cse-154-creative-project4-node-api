/**
 * Joselyn Do
 * May 17th, 2024
 * Section AB: Elias & Quinton
 *
 * This app.js file handles the queries for the CP4 Flower Garden Walk's API information.
 * This file handles information about lists of flowers, flower information, and
 * the recommendation percentage (how many users would recommend the Garden Walk).
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const YES_VOTE = "yes";
const NO_VOTE = "no";

/**
 * Generates three lists of randomized flowers,
 * where the amount of flowers depends on the given quantity
 */
app.get("/random-flowers/:amount", async function(req, res) {
  res.type("text");
  try {
    let amountOfFlowers = parseInt(req.params.amount);
    if (amountOfFlowers < 1) {
      res.status(400).send("Invalid quantity");
    }
    let flowersList = await fs.readFile("data/flower.txt", "utf-8");
    let flowersArr = flowersList.split("\n");
    let flowersLists = generateRandomFlowersLists(flowersArr, amountOfFlowers);
    let flowerText = turnFlowerArrsIntoStr(flowersLists);
    res.send(flowerText);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to generate random lists of flowers");
    } else {
      res.status(500).send("An error has occurred on the server");
    }
  }
});

/**
 * Get the information for the specified flower. The information includes an image,
 * the image's credit, a fact, and the fact's credit.
 */
app.get("/flower/:flowerName", async function(req, res) {
  try {
    let flowersInfo = await fs.readFile("data/flower-info.json", "utf-8");
    flowersInfo = JSON.parse(flowersInfo);
    let specificFlowerInfo = flowersInfo[req.params.flowerName];
    if (specificFlowerInfo === undefined) {
      res.type("text").status(400).send("Flower not supported");
    } else {
      res.json(specificFlowerInfo);
    }
  } catch (error) {
    res.type("text");
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to access the flower information file");
    } else {
      res.status(500).send("An error has occurred on the server");
    }
  }
});

/** Records the recommendation of the user */
app.post("/recommendation/add", async function(req, res) {
  try {
    let recommendation = req.body.recommendation;
    res.type("text");

    if (recommendation === YES_VOTE || recommendation === NO_VOTE) {
      let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
      let yesNoCount = processRecText(recommendationText);
      let newFileText = handleRecommendationVote(yesNoCount, recommendation);
      await fs.writeFile("data/recommendation-count.txt", newFileText);
      res.send("Thank you for your feedback");
    } else {
      res.status(400).send("No valid input received for recommendation");
    }
  } catch (error) {
    res.type("text");
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to access file with requested information");
    } else {
      res.status(500).send("An error has occurred on the server");
    }
  }
});

/** Sends the percentage of past visitors who would recommend the Garden Walk */
app.get("/recommendation/get", async function(req, res) {
  try {
    let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
    let yesNoCount = processRecText(recommendationText);
    let recommendPercentage = Math.round(100 * yesNoCount[0] / (yesNoCount[0] + yesNoCount[1]));
    res.type("text").send(recommendPercentage.toString());
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to access file with requested information");
    } else {
      res.status(500).send("An error has occurred on the server");
    }
  }
});

/**
 * Returns an array containing the number of people who would or wouldn't recommend the Garden Walk
 * @param {String} text - String to process
 * @return {Number[]} - A number array containing the amount of people who would recommend the
 *                      Garden Walk and then the amount of people who would not recommend it
 */
function processRecText(text) {
  let splitByOption = text.split("\n");
  let splitByOptionAndAmount = [];
  for (let i = 0; i < splitByOption.length; i++) {
    splitByOptionAndAmount.push(splitByOption[i].split(":"));
  }

  let yesNoCount = [parseInt(splitByOptionAndAmount[0][1]), parseInt(splitByOptionAndAmount[1][1])];
  return yesNoCount;
}

/**
 * Updates the number of recommendations for Garden Walk
 * @param {Number[]} yesNoCount - Array of the counts recommending or not recommending the Garden
 *                                Walk
 * @param {String} rec - String representing whether the user would or wouldn't recommend the
 *                          Garden Walk
 * @return {String} - String recording the number of recommendations
 */
function handleRecommendationVote(yesNoCount, rec) {
  if (rec === YES_VOTE) {
    yesNoCount[0]++;
  } else {
    yesNoCount[1]++;
  }

  return YES_VOTE + ":" + yesNoCount[0] + "\n" + NO_VOTE + ":" + yesNoCount[1];
}

/**
 * Generates a list of three lists containing the flowers that can be shown on one of three paths
 * @param {String[]} flowersArr - List of all flowers that can be shown
 * @param {Number} amountOfFlowers - The amount of flowers to show on a path
 * @return {(String[])[]} - 2D array containing the list of flowers for each path
 */
function generateRandomFlowersLists(flowersArr, amountOfFlowers) {
  let flowersOnPathsArr = [[], [], []];
  let possibleFlowersAmount = flowersArr.length;

  for (let pathNum = 0; pathNum < flowersOnPathsArr.length; pathNum++) {
    while (flowersOnPathsArr[pathNum].length < amountOfFlowers) {
      let selectedFlowerIndex = Math.floor(Math.random() * possibleFlowersAmount);
      let flowerName = flowersArr[selectedFlowerIndex];
      flowersOnPathsArr[pathNum].push(flowerName);
    }
  }

  return flowersOnPathsArr;
}

/**
 * Records the flowers for each of the three paths in the returned string
 * @param {(String[])[]} flowersLists - 2D array containing the flowers for each path
 * @return {String} - String containing the information from the passed in flowersLists
 */
function turnFlowerArrsIntoStr(flowersLists) {
  let str = "";
  for (let pathNum = 0; pathNum < flowersLists.length - 1; pathNum++) {
    for (let flower = 0; flower < flowersLists[pathNum].length - 1; flower++) {
      str += flowersLists[pathNum][flower] + ":";
    }

    str += flowersLists[pathNum][flowersLists[pathNum].length - 1] + "\n";
  }

  let lastPath = flowersLists.length - 1;
  for (let flower = 0; flower < flowersLists[lastPath].length - 1; flower++) {
    str += flowersLists[lastPath][flower] + ":";
  }

  str += flowersLists[lastPath][flowersLists[lastPath].length - 1] + "\n";

  return str;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);