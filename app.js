/**
 * Header comment
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

app.get("/random-flowers/:amount", async function(req, res) {
  res.type("text");
  try {
    let amountOfFlowers = parseInt(req.params.amount);
    let flowersList = await fs.readFile("data/flower.txt", "utf-8");
    let flowersArr = flowersList.split("\n");
    let flowersLists = generateRandomFlowersLists(flowersArr, amountOfFlowers);
    let flowerText = turnFlowerArrsIntoStr(flowersLists);
    res.send(flowerText);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to generate random lists of flowers");
    } else {
      res.status(500).send("An error has occured on the server");
    }
  }
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
    let recommendation = req.body.recommendation;
    res.type("text");

    if (recommendation) {
      let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
      let yesNoCount = processRecText(recommendationText);
      let newFileText = handleRecommendationVote(yesNoCount, recommendation);
      await fs.writeFile("data/recommendation-count.txt", newFileText);
      res.send("Thank you for your feedback.");
    } else {
      res.status(400).send("No input received for recommendation.");
    }
  } catch (error) {
    res.type("text");
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to find file with requested information.");
    } else {
      res.status(500).send("An error has occured on the server.");
    }
  }
});

app.get("/recommendation/get", async function(req, res) {
  try {
    let recommendationText = await fs.readFile("data/recommendation-count.txt", "utf-8");
    let yesNoCount = processRecText(recommendationText);
    let recommendPercentage = Math.round(100 * yesNoCount[0] / (yesNoCount[0] + yesNoCount[1]));
    res.type("text").send(recommendPercentage.toString());
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(500).send("Unable to find file with requested information.");
    } else {
      res.status(500).send("An error has occured on the server.");
    }
  }
});

function processRecText(text) {
  let splitByOption = text.split("\n");
  let splitByOptionAndAmount = [];
  for (let i = 0; i < splitByOption.length; i++) {
    splitByOptionAndAmount.push(splitByOption[i].split(":"));
  }

  let yesNoCount = [parseInt(splitByOptionAndAmount[0][1]), parseInt(splitByOptionAndAmount[1][1])];
  return yesNoCount;
}

function handleRecommendationVote(yesNoCount, rec) {
  if (rec === YES_VOTE) {
    yesNoCount[0]++;
  } else {
    yesNoCount[1]++;
  }

  return YES_VOTE + ":" + yesNoCount[0] + "\n" + NO_VOTE + ":" + yesNoCount[1];
}

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