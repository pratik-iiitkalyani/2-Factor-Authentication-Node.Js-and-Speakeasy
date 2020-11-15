'use strict';
const Express = require('express')
const BodyParser = require('body-parser');
const { JsonDB } = require("node-json-db")
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

const Port = process.env.port || 5000;

const App = Express();

// Initialize database using node-json-db
// const Db = new JsonDB(new Config('myDatabase', true, false, '/'))


// Middleware
// App.use(cors());
App.use(BodyParser.urlencoded ({
    extended: false
}));
App.use(BodyParser.json());

// Use API routes in the app
require('./routes')(App)

// Start the Server
App.listen(Port, ()=>{
	console.log(`surver running on port ${Port}`)
})

module.exports = {
    App
}