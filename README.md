# COMP5347 Group Assignment - PhoneZone

## Description

This is an eCommerce SPA for use by PhoneZone. Collaboratively put together by group 30.

It is split up into client and server directories. The server is using the build file of the client to serve the root page. The client will handle frontend routing from this point, and the server will act as a backend API.

## Gettings Started

### Dependencies

-   Node.js
-   npm or yarn

### Downloading

-   Either clone this repo or download a copy of the zip file.

### Database setup

1. Unzip the database zip file
2. Import the two json files into your database. Refer to [importing to db](##importing-database) for more information.
3. Update the imageurls. Refer to [replacing urls](##updating-image-urls-in-database) for more information.
4. modify the mongodb connection string in the .env file to point to your database.

### Installing

1.  Navigate to the server folder and install dependencies
    > `cd server && npm install`
2.  Install client dependencies and build
    > `npm run build-client`
        or

> `cd client && npm install && npm run build`

### Running

1. Ensure you are in the root folder of the server
2. Start the server
    > `npm start`

### Using

1. View in browser.
    > Open at [http://localhost:9000](http://localhost:9000) to view in browser.

## Development Instructions

### Folder Structure

#### Server

```
/controllers
/models
/routes
app.js
```

-   controllers - all functionality interacting with the database is here.
-   models - all mongoose/mongodb schemas here. These mirror what's in the json schemas and any additional properties that are needed.
-   routes - route paths here, these will call needed functionality from controllers.
-   app.js - entry point.

#### Client

```
src/
    index.js
    App.js
    /components
    /context
    /services
    /styles

```

-   index.js - app entry point
-   App.js - functionality entry point
-   components - all the apps small components are here
-   context - any important contexts (cart) is here along with any Reducers
-   services - any app wide configuration is here (axios, auth hook, constant variables)
-   styles - stylesheets referred to by components.

### Making changes

Note: The server is serving the production build file from the client. Found at `/build/index.html` in the client directory. If you're working on the client and viewing from the server you'll need to run `npm build` in the client directory beforehand, and restart the server.

#### Client only dev

Note: If you're just working on the client:

1. Start client dev server
    > `npm start`
2. Changes are hot reloaded at [http://localhost:3000](http://localhost:3000) in browser

## Importing database

1. Create a database in MongoDB Atlas
2. Connect using the mongo shell
3. Import the userlist and phonelisting json data

```
mongoimport \
--uri mongodb+srv://adminname:testadmin@phonezone.ixyyf.mongodb.net/{db_name} \
--collection users \
--type json \
--file {path}/userlist_demo.json \
--jsonArray
```

```
mongoimport \
--uri mongodb+srv://adminname:testadmin@phonezone.ixyyf.mongodb.net/{db_name} \
--collection phones \
--type json \
--file {path}/phonelisting_demo.json \
--jsonArray
```

## Updating image urls in database

-   The image urls in the dataset need to be updated. There are a number of ways to achieve this. The method described uses the mongo db shell.

1. Connect to the db via mongo shell

2. select the collection you are using
    > `use phonezonetester`
3. run update commands:

    > `db.phones.update({"brand": "Apple"}, {$set: {"image": "Apple.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "BlackBerry"}, {$set: {"image": "BlackBerry.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "HTC"}, {$set: {"image": "HTC.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "Huawei"}, {$set: {"image": "Huawei.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "LG"}, {$set: {"image": "LG.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "Motorola"}, {$set: {"image": "Motorola.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "Nokia"}, {$set: {"image": "Nokia.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "Samsung"}, {$set: {"image": "Samsung.jpeg"}}, {"multi":true});`

    > `db.phones.update({"brand": "Sony"}, {$set: {"image": "Sony.jpeg"}}, {"multi":true});`
