// ==== Libraries used ====
var express = require("express")
var cors = require("cors")
var dotEnv = require('dotenv').config()

// ==== Local Modules used ====
var Config = require('./config/constants')
var DatabaseHelper = require('./helper/databaseHelper')
var Api = require('./api/api')
var ErrorCheckHelper = require('./helper/errorCheckHelper')



// ==== Connecting to Database here ====
DatabaseHelper()

// ==== Making an object of Express and Configuring it ====
var app = express()
app.set('port', Config.port)
app.use(cors())
app.use(express.json())

// ==== Setting primary Route (/api) ====
app.use("/api", Api)


// ==== Final middleware that runs only in cases where Primary middlewares throw errors ====
app.use(ErrorCheckHelper)

module.exports  = app



