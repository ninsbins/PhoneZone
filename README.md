# COMP5347 Group Assignment

eCommerce Web Application

## General Info

-   Repo split up into server and client

### Client

-   Client is just created using create-react-app, don't need to do anything here yet but I wanted to show how the build is served by the server.

### Server

#### Database

-   Imported phonelisting.json and userlisting.json into MongoDB via atlas. You'll have an invite via email a couple of days ago if you want to access it directly.
-   Server is connected to this database via mongoose.

#### Structure

```
/controllers
/models
/routes
app.js
```

-   controllers - add all functionality interacting with the database here.
-   models - all mongoose/mongodb schemas here. These will need to mirror what's in the json schemas and any additional properties that are needed.
-   routes - route paths here, these will call needed functionality from controllers.
-   app.js - entry point.

## Running

1. Start server (defaults to port 9000)
    > `npm start`
2. Start client (defaults to port 3000)
    > `npm start`
3. Open at [http://localhost:9000](http://localhost:9000) to view in browser.

## Making changes

Note: The server is serving the production build file from the client. Found at `/build/index.html` in the client directory. If you're working on the client and viewing from the server you'll need to run `npm build` in the client directory beforehand, and restart the server.

### Client

Note: If you're just working on the client:

1. Start client dev server
    > `npm start`
2. Changes are hot reloaded at [http://localhost:3000](http://localhost:3000) in browser

### Process

Pre-stage:

1. Clone repo
    > `git clone <repo>`

Regulary (this is just a suggested workflow based on our meeting, no pull requests and just some feature branches to keep organised):

1. Create a branch for feature.

    > `git branch <name_of_feature>`

    > `git checkout <name_of_feature>`

    or

    > `git checkout -b <name_of_feature>`

2. Make changes, test everything works as excepted after change and commit.

    > `git add .`

    > `git commit -m "a useful commit message"`

3. Check for changes that have happened and merge branch to main.

    > `git checkout main`

    > `git pull origin main`

    > `git merge <name_of_feature>`

4. Push to repo
    > `git push origin main`

..small change to check contribution settings

## Mongo commands for updating phones via mongo shell.

This is just one way to update the phone image fields, lots of other ways.

1. Connect to the db
2. `use phonezone`
3. run the below commands:

`db.phones.update({"brand": "Apple"}, {$set: {"image": "Apple.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "BlackBerry"}, {$set: {"image": "BlackBerry.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "HTC"}, {$set: {"image": "HTC.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "Huawei"}, {$set: {"image": "Huawei.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "LG"}, {$set: {"image": "LG.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "Motorola"}, {$set: {"image": "Motorola.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "Nokia"}, {$set: {"image": "Nokia.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "Samsung"}, {$set: {"image": "Samsung.jpeg"}}, {"multi":true});`

`db.phones.update({"brand": "Sony"}, {$set: {"image": "Sony.jpeg"}}, {"multi":true});`
