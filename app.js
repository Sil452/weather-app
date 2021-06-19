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
        const temp = Math.floor(weatherApp.main.temp);
        const description = weatherApp.weather[0].description;
        const icon = weatherApp.weather[0].icon;
        const imgUrl = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Weather App</title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link rel="stylesheet" type="text/css"   href="/css/style.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Open+Sans&display=swap" rel="stylesheet">
          </head>

          <body>
            <section id="form" class="position-absolute bottom-0 start-50 translate-middle-x">
            <div class="container form-in-post">
              <form action='/' method='POST'>
                <label for='cityName' class="form-label">Please choose a city</label>
                <input class="form-control" type='text' name='cityName' id='cityName'>
                <button class="btn btn-primary mb-3">Check</button>
              </form>
            </div>
          </section>
          </body>
        </html>`)

        res.write(`
        <section id="weather" class="position-absolute top-0 start-50 translate-middle-x">
          <div class="container text-center">
            <h1 class="cityName"> ${query.toUpperCase()}</h1>
            <h3 class="temp">${temp}°</h3>
            <p>${description}</p>
            <img  src = ${imgUrl}>
          </div>
        </section>`);
        res.send();
      })
    });
  });

app.listen(3000, function(){
  console.log('The server is running on: localhost 3000.');
});