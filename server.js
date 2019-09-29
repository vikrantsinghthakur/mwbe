const express = require("express");
var cors = require("cors");
const app = express();
const port = 9000;
const axios = require("axios");
const config = require("./config");

app.use(express.json());
app.use(cors());

let responseEntity = [
  {
    formatted_address: "Kleiner Wesenberg, 15377 Oberbarnim, Germany",
    id: "ChIJc_wstnnTqUcRdrzMMduxO9Y",
    latLng: {
      lat: 52.593046747923765,
      lng: 14.04444390429694
    }
  }
];

app.get("/", (req, res) => res.json(responseEntity));

app.get("/:id", (req, res) => {
  responseObjects = responseEntity.filter((obj, index) => {
    return index + 1 === parseInt(req.params.id) ? obj : null;
  });
  return res.json({ data: responseObjects });
});

app.get("/addressFromString/:str", (req, res) => {
  axios
    .get(
      `${config.mapApiUrl}?address=${req.params.str.replace(/ /g, "+")}&key=${
        config.mapApiKey
      }`
    )
    .then(mapApiRes => {
      res.json(mapApiRes.data);
    })
    .catch(err => res.status(500).json("Could not find address"));
});

app.put("/:id", function(req, res) {
  if (
    req.body.formatted_address &&
    req.body.latLng &&
    req.body.latLng.lat &&
    req.body.latLng.lng
  ) {
    responseEntity = responseEntity.map((todo, index) => {
      if (req.params.id === todo.id) {
        return req.body;
      }
      return todo;
    });
  }
  res.json(responseEntity);
});

app.post("/", function(req, res) {
  if (
    req.body.formatted_address &&
    req.body.latLng &&
    req.body.latLng.lat &&
    req.body.latLng.lng
  ) {
    responseEntity.push(req.body);
    res.json(req.body);
  } else {
    res.status(500).json("Invalid params");
  }
});

app.post("/marker", function(req, res) {
  axios
    .get(
      `${config.mapApiUrl}?latlng=${req.body.lat},${req.body.lng}&key=${
        config.mapApiKey
      }`
    )
    .then(mapApiRes => {
      res.json(mapApiRes.data.results);
    });
});

app.delete("/:id", function(req, res) {
  responseEntity = responseEntity.filter((todo, index) => {
    return req.params.id !== todo.id;
  });
  res.json(responseEntity);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
