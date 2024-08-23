
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
### Deploy
Create __mta.yaml__ file under project folder __cfdemo__
```yaml
ID: cfdemo
_schema-version: '3.1'
version: 0.0.1
parameters:
  enable-parallel-deployments: true

modules:
  - name: cfdemo-service
    type: nodejs
    path: srv
    build-parameters:
      ignore:    
        - 'default-*.json'
        - .env
        - '*node_modules*'
        - package-lock.json
```
if the application requires third-party libraries, add them in the package.json file. 

Create the package.json file at the same level as the mta.yaml file.

```json
{
    "name":"mta-project",
    "version":"0.0.1",
    "description": "Built and deployment scripts",
    "scripts":{
        "clean":"rimraf resources mta_archives --mta-op*",
        "build":"rimraf resources mta_archives && mbt build --mtar archive",
        "deploy":"cf deploy mta_archives/archive.mtar --retries 1",
        "undeploy":"cf undeploy cfdemo --delete-services --delete-service-keys --delete-service-brokers"

    },
    "devDependencies": {
        "mbt": "^1.2.25",
        "rimraf": "^3.0.2"
    }
}
```
Install dependencies under project folder
```sh 
cd ..
npm install
```

execute command build.

```sh
npm run build
```

Login in CF.

```sh
cf login
```

execute command deploy

```sh
npm run deploy
```
