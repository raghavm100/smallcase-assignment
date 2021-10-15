// ==== Libraries used ====

// ==== Local Modules used ====
var Trade = require('./tradeModel')
var Asset = require('../asset/assetModel')
const assetModel = require('../asset/assetModel')



// ==== Fetch all Trades ====
exports.fetchTrades = async(req, res, next) => {
    try{
        let reqQuery = req.query
        let limit = parseInt(reqQuery.limit) || 10
        let offset = parseInt(reqQuery.offset) || 0

        let totalTrades = await Trade.find({}).countDocuments()
        let tradeList = await Trade.find()
            .sort({createdAt: -1})
            .limit(limit)
            .skip(offset)

        let resObj = {
            totalCount: totalTrades,
            totalPages: Math.ceil(totalTrades / limit),
            pageCount: (limit + offset) / limit,
            tradeList: tradeList
        }

        res.json(resObj)
        
    }catch(err){
        next(err)
    }
}



// ==== Add Trade ====
exports.buySecurity = async (req, res, next) => {
    try{
        let reqBody = req.body
        // ==== TODO: Remove tradeType as the API method defines it. 
        // let resObj = "Asset purchased successfully"
        let assetExists = false

        let existingAsset = await assetModel.findOne({ ticker: reqBody.ticker })
        if(existingAsset){
            assetExists = true
            if(existingAsset.assetType !== reqBody.assetType){
                // ==== TODO: Throw Error saying asset type is different
            }
        }        
        
        let purchasedTrade = await Trade.create(reqBody)
        if(assetExists){
            existingAsset.averagePrice = ( (existingAsset.averagePrice * existingAsset.quantity) + (purchasedTrade.amount * purchasedTrade.quantity) ) / (existingAsset.quantity + purchasedTrade.quantity)
            existingAsset.quantity += purchasedTrade.quantity
            existingAsset.save()
        }else{
            await Asset.create({
                ticker: purchasedTrade.ticker,
                averagePrice: purchasedTrade.amount,
                quantity: purchasedTrade.quantity,
                assetType: purchasedTrade.assetType
            })
        }

        res.json(purchasedTrade)
    }catch(err){
        next(err)
    }
}


// ==== Sell Asset ====
exports.sellSecurity = async(req, res, next) => {
    try{
        let reqBody = req.body
        // ==== TODO: Remove tradeType as the API method defines it. 
        
        let existingAsset = await Asset.findOne({ ticker: reqBody.ticker, assetType: reqBody.assetType })
        if(!existingAsset){
            // ==== TODO: Throw error that Asset does not exist in portfolio.
            res.end("Asset does not exist")
            return
        }

        if(existingAsset.quantity < reqBody.quantity){
            // ==== TODO: Throw error that you do not own enough quantity to sell.
            res.end("Not enough quantity")
            return
        }

        // ==== TODO: Add check if both quantities are same, all values of that asset has to be sold and removed from portfolio ====

        let soldTrade = await Trade.create(reqBody)
        existingAsset.quantity = existingAsset.quantity - soldTrade.quantity
        existingAsset.save()

        res.json(soldTrade)

    }catch(err){
        next(err)
    }
}


// ==== Remove a trade ====
exports.deleteTrade = async(req, res, next) => {
    try{
        let reqParams = req.params
        let deleteAsset = false
        let genericResponse
        
        let tradeDetails = await Trade.findById(reqParams.id).lean()
        let assetDetails = await Asset.findOne({ticker: tradeDetails.ticker})

        // ==== TODO: Throw error if asset details is not found ====

        if(tradeDetails.tradeType === "buy"){
            if(tradeDetails.quantity === assetDetails.quantity){
                // ==== TODO: Delete asset from portfolio ====
                deleteAsset = true
            }else{
                // ==== Reseting Price and quantity ====
                assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) - (tradeDetails.amount * tradeDetails.quantity)) / (assetDetails.quantity - tradeDetails.quantity)
                assetDetails.quantity = (assetDetails.quantity - tradeDetails.quantity)
            }
        }
        else if(tradeDetails.tradeType === "sell"){
            // ==== NOTE: We have a loop hole here. If all the the entire asset is sold, we will not have track of it's average price ====
            assetDetails.quantity = (assetDetails.quantity + tradeDetails.quantity)
        }

        await Trade.findByIdAndRemove(tradeDetails._id)
        if(deleteAsset){
            await Asset.findByIdAndRemove(assetDetails._id)
        }else{
            assetDetails.save()
        }

        
        res.end("Trade deleted")

    }catch(err){
        next(err)
    }
}



// ==== Update Trade ====
exports.updateTrade = async(req, res, next) => {
    try{

        /*

            possibility of update: 
            "ticker": "PKC",
            "tradeType": "buy",
            "amount": 9,
            "quantity": 10,
            "assetType": "bond",

        */

        let reqParams = req.params
        let reqBody = req.body

        let oldTrade = await Trade.findById(reqParams.id).lean()
        let assetDetails = await Asset.findOne({ticker: oldTrade.ticker})

        // ==== check if the Ticker is same ====
        if(oldTrade.ticker === reqBody.ticker){
            let oldTradeFactor = oldTrade.tradeType === "buy" ? -1 : 1
            let newTradeFactor = reqBody.tradeType === "buy" ? 1 : -1
            
            // ==== Removing old trade from Assets ====
            assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) + (oldTrade.amount * oldTrade.quantity * oldTradeFactor)) / (assetDetails.quantity + (oldTrade.quantity*oldTradeFactor))
            assetDetails.quantity = (assetDetails.quantity + (oldTrade.quantity*oldTradeFactor))

            console.log(assetDetails)

            // ==== Updating new trade details into Asset ====
            assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) + (reqBody.amount * reqBody.quantity * newTradeFactor)) / (assetDetails.quantity + (reqBody.quantity*newTradeFactor))
            assetDetails.quantity = (assetDetails.quantity + (reqBody.quantity*newTradeFactor))

            if(assetDetails.averagePrice < 0 || assetDetails.quantity < 0){
                // TODO: Throw error saying asset price or quantity is hitting below 0.
                console.log("Breaking below 0 barrier")
            }

        }else{
            // ==== Remove trade from asset ====
            // ==== Update trade and check it's implications on Asset ====
        }

        res.json(assetDetails)

    }catch(err){
        next(err)
    }
}



