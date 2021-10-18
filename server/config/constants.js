
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
    port: process.env.PORT,

    // ==== Database URL ====
    dbUrl: process.env.DATABASE_URL,

    // ==== Assumed stock price when finding total returns ====
    assumedCurrentPrice: 100,
}