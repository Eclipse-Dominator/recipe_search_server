// main app
import express = require("express");
import fs = require("fs");
const util = require("util");

var recursive = require("recursive-readdir");
const readdir = util.promisify(fs.readdir);

const app: express.Application = express();

var recipe_database = {};

app.get("/", (req, res) => {
  let searchquery = req.query.search;
  if (searchquery) {
    res.send("FE");
  } else {
    res.send();
  }
});

app.get("/refresh/", (req, res) => {
  initFiles()
    .then((result) => {
      res.send("Files reinitialized\n");
    })
    .catch((err) => {
      console.log(recipe_database);
      res.send("fail");
    });
});

app.listen(3000, () => {
  console.log("app on port 3000");
});

var initFiles = async (): Promise<void> => {
  let results = await recursive("D:/Actual_Productivity/Recipes");
  let headerString = "D:/Actual_Productivity/Recipes/".replace(/\//g, "\\");
  let delimeter = "\\";
  for (let result of results) {
    let filePath = result;
    result = result.replace(headerString, "");
    let path = result.split(delimeter);
    let [fname, ftype] = path.slice(-1)[0].split(".");
    let obj = {
      path: path,
      type: ftype,
      filename: fname,
      rawPath: filePath,
    };

    recipe_database[fname] = obj;
  }
  console.log(recipe_database);
};
