// ==== Libraries used ====
var mongoose = require("mongoose")

// ==== Local Modules used ====


// ==== Configuration ====
var Schema = mongoose.Schema

// ==== Primary schema ====
var tradeSchema = new Schema({
    ticker: {
        type: String,
        required: [true, "Ticker name is required"]
    },
    tradeType: {
        type: String,
        enum: ["buy", "sell"],
        required: [true, "tradeType is required"]
    },
    amount: {
        type: Number,
        min: 0,
        default: 0
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


// tradeSchema.post('find', function(next){
//     let obj = this

//     obj.tradeId = obj._id
//     delete obj._id
//     delete obj.updatedAt
//     delete obj.createdAt
//     delete obj.__v
//     next(obj)
// })


module.exports = mongoose.model("trade", tradeSchema, "trade")

