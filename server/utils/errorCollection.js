
/*
    ====
    This file holds all custom and
    generic error messages with their
    status code. 

    This file acts as a dictionary for
    error codes.
    ====
*/

module.exports = {

    // ==== Generic errors ====
    notFound: {
        code: 404
    },

    notAcceptable: {
        code: 406
    },


    // ==== Custom Errors ====

    // ==== Trade not found ====
    noTrade: {
        code: 404,
        message: "Trade not found"
    },

    // ==== Asset not found ====
    noAsset: {
        code: 404,
        message: "Asset not found"
    },

    // ==== Quantity dropped below 0 ====
    negativeQuantity: {
        code: 406,
        message: "Action not acceptable, pushing asset quantity below zero (0)"
    },

    // ==== Invalid Endpoint ====
    invalidEndpoint: {
        code: 404,
        message: "Invalid Endpoint"
    }




}