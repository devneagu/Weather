const path = require("path");
const express = require("express");
const { prependOnceListener } = require("process");
const fetch = require("node-fetch");
const app = express();
const port = 8000;

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.get("/query", async (req, res) => {
  const location = req.param("location");
  console.log(location);
  await fetch(
    "https://www.metaweather.com/api/location/search/?query=" + location
  )
    .then((data) => data.text())
    .then((text) => res.send(text));
});

app.get("/location", async (req, res) => {
  const woeid = req.param("id");
  console.log(woeid);
  await fetch("https://www.metaweather.com/api/location/" + woeid)
    .then((data) => data.text())
    .then((text) => res.send(text));
});
