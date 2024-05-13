/**
 * Header comment
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const app = express();

app.use(multer().none());



app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);