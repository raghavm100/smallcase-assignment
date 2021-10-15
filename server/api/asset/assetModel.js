// ==== Libraries used ====
var mongoose = require("mongoose")

// ==== Local Modules used ====


// ==== Configuration ====
var Schema = mongoose.Schema

// ==== Primary schema ====
var assetModel = new Schema({
    ticker: {
        type: String,
        required: [true, "Ticker name is required"]
    },
    averagePrice: {
        type: Number,
        min: 0,
        required: [true, "Average Price is required"]
    },
    quantity: {
        type: Number,
        min: 1,
        require: [true, "Quantity is required"]
    },
    assetType: {
        type: String,
        enum: ["stock", "bond", "commodity", "currency"],
        default: "stock"
    }
},
    {timestamps: true}
)



module.exports = mongoose.model("asset", assetModel, "asset")

