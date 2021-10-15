
/*
    ====
    This file is responsible for 
    holding all constants that are loaded once only.
    
    These constants may be hardcoded constants 
    or may be fetched from the environment files.
    ====
*/

module.exports = {

    // ==== Server ports and initial config ====
    port: 3001,

    // ==== Database URL ====
    dbUrl: "",

    // ==== Assumed stock price when finding total returns ====
    assumedCurrentPrice: 100,
}