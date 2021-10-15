// ==== Libraries used ====
var express = require("express")
var cors = require("cors")

// ==== Local Modules used ====
var Config = require('./config/constants')
var DatabaseHelper = require('./helper/databaseHelper')
var Api = require('./api/api')



// ==== Connecting to Database here ====
DatabaseHelper()

// ==== Making an object of Express and Configuring it ====
var app = express()
app.set('port', Config.port)
app.use(cors())
app.use(express.json())
app.use("/api", Api)


// ==== TODO: include error handling middleware ====
module.exports  = app

