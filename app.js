const express = require('express');
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res){

  const apiKey = "448385fead47b54d9a6b8ef9e045b479";
  const query = req.body.cityName;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units="+ unit +"&appid=" + apiKey;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherApp = JSON.parse(data);
      const temp = weatherApp.main.temp;
      const description = weatherApp.weather[0].description;
      const icon = weatherApp.weather[0].icon;
      const imgUrl = " http://openweathermap.org/img/wn/" + icon + "@2x.png";
      
      res.write(` <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Weather App</title>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link rel="stylesheet" type="text/css"   href="/css/style.css">
        </head>
        <body>
          <h1>Welcome to Weather</h1>
          <form action='/' method='POST'>
            <label for='cityName'>Please choose a city</label>
            <input type='text' name='cityName' id='cityName'>
            <button>Check</button>
          </form>
        </body>
      </html>`)
      res.write("<h3>The temperature in " + query + " is: " + temp + " degrees</h3>");
      res.write("<p>" + description + "</p>");
      res.write("<img src =" + imgUrl + ">");
      res.send();
    })
  });
});

app.listen(3000, function(){
  console.log('The server is running on: localhost 3000.');
});