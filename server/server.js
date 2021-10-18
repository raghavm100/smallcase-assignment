// ==== Libraries used ====
var express = require("express")
var cors = require("cors")
var dotEnv = require('dotenv').config()

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


app.use(function(err, req, res, next){
    console.log(err)
    // ==== building error structure obj ====
    let errRes = {
        code: 404,
        messageList: []
    }

    // ==== Switch case to check the type of error ====
    switch(err.name){
        case "Error": {
            errRes.code = 400
            err.errors.map(errorValue => {
                errRes.messageList.push(errorValue.msg)
            })
        }break;

        default: {
            errRes.code = 500
            errRes.messageList.push("An unexpected error occured")
        }
    }
    
    res.status(errRes.code).json(errRes)
})


// ==== TODO: include error handling middleware ====
module.exports  = app



