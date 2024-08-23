
##  Create NodeJS Application 
```sh
mkdir cfdemo/srv
cd srv
npm init --y
```

Add express library under __srv__ folder
```sh
npm install express
```
Add script start in srv/package.json
```json
"scripts": {
    "start": "node server.js"
  }
```
Create file server.js under __srv__ folder add the next code
```js
const express = require("express");
const app = express();

app.get("/", function(req, res, next){
    res.send("Welcome to Basic NodeJs");
});

const port = process.env.PORT || 5000;
app.listen(port, function(){console.log("Basic NodeJS listening on port " + port);});
```
start de App
```sh
npm run start
```
