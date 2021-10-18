
/*
    ====
    This Product is built and
    managed by Raghav Mishra
    -------------------------
    This Product is build as an
    assignment for Smallcase.
    -------------------------
    The application is responsible 
    for handling CRUD operations
    on Portfolio management. 
    -------------------------

    Developed and Designed by-
    Raghav Mishra
    ====
*/


// ==== Libraries used ====
var Http = require("http")

// ==== Local Modules used ====
var App = require('./server/server')

// ==== Setting up and starting http server ====
var server = Http.createServer(App)
server.listen(App.get('port'), () => {
    console.log(`Express server is running on port ${App.get('port')}`)
})