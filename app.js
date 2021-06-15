const express = require('express');
const https = require("https");

const app = express();



app.get("/", function(req, res){

  const url = "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=448385fead47b54d9a6b8ef9e045b479";

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherApp = JSON.parse(data);
      const temp = weatherApp.main.temp;
      const description = weatherApp.weather[0].description;
      console.log(temp);
      console.log(description);
    })
  });

  res.send("Testing");
});

app.listen(3000, function(){
  console.log('The server is running on: localhost 3000.');
});