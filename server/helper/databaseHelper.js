// ==== Libraries used ====
var Mongoose = require("mongoose")


// ==== Local modules used ====
var Config = require("../config/constants")

module.exports = () => {
    try{
        let databaseUrl = Config.dbUrl
        Mongoose.connect(databaseUrl, {useNewUrlParser: true})
    }catch(err){
        console.log("Database Error")
        console.log(err)
    }
}