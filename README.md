
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
### Approuter 
create __app__ folder under __cfdemo__ and initialize

```sh
mkdir app
cd app
npm init --y
```
Edit package.json and add the script start
```json
 "scripts": {
    "start": "node node_modules/@sap/approuter/approuter.js"
  }
```

install @sap/approuter
```sh
npm install @sap/approuter
```

add new file xs-app.json under app folder

```json
{
    "authenticationMethod": "none",
    "routes": [
        {
            "source": "^/(.*)$",
            "target":"$1",
            "destination": "srv-api"
        }
    ]
}
```

add services in __mta.yaml__ file

```yaml
- name: cfdemo-approuter
    type: approuter.nodejs
    path: app
    build-parameters:
      ignore:    
        - 'default-*.json'
        - .env
        - '*node_modules*'
        - package-lock.json
    parameters:
      memory: 256M
      disk-quota: 512M
      keep-existing-routes: true
    requires:
      - name: srv-api
        group: destinations
        properties:
          name: srv-api
          url:  ~{srv-url}
          timeout: 55000
```
add __srv-api__ in the __cfdemo- service__

```yaml
provides:
      - name: srv-api
        properties:
          srv-url: ${default-url}
```
Deploy the application with the added changes

```sh
npm run clean
npm run build
npm run deploy
```

### XSUAA 
 __xs-app.json__
 ```json
 "authenticationMethod": "route"
 ```

create resources in __mta.ymal__ file
```yaml
resources:
  - name: cfdemo-xsuaa
  type: org.cloudfoundry.managed-service
  parameters:
    service: xsuaa
    service-plan: application
    config:
      xsappname: cfdemo-${org}-${space}
      tenant-mode: dedicated
```
bind the __xsuaa__ service under __cfdemo-service__

```yaml
requires:
    - name: cfdemo-xsuaa
```
after
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
    requires:
    - name: cfdemo-xsuaa
```
add requires in cfdemo-service
```yaml
    forwardAuthToken: true 
- name: cfdemo-xsuaa
```
add resources
```yaml
 oauth2-configuration:
        redirect-uris:
        - "https://*.hana.ondemand.com/**"
```
deploy again

### Authentication
add libraries in __srv__ folder __@sap/xsenv__, __@sap/xssec__, __passport__ 
```json
"dependencies": {
    "express": "^4.19.2",
    "@sap/xsenv": "^3.1.1",
    "@sap/xssec": "^3.2.7",
    "passport": "^0.5.0"
  }
```
declare libraries in __server.js__

```js
const express = require("express");
const passport = require("passport");
const xsenv = require("e@sap/xsenv");
const JWTStrategy = require("@sap/xssec").JWTStrategy;
const services = xsenv.getServices({uaa: "cfdemo-xsuaa"});//xsuaa service
const app = express();


passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT",{session:false}));

/*app.get("/", function(req, res, next){
    res.send("Welcome to Basic NodeJs");
});*/


app.get("/", function(req, res, next){
    res.send("Welcome to Basic NodeJs");
});
const port = process.env.PORT || 6000;
app.listen(port, function(){console.log("Basic NodeJS listening on port " + req.user.id);});
```