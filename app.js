/**
 * Header comment
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const app = express();

app.use(multer().none());

// API: get list of random flowers of length 5 -> input
// API: get info for a specific flower -> click l/r buttons

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);