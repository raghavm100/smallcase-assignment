// ==== Libraries used ====
var { validationResult } = require('express-validator')

// ==== Local Modules used ====
var Trade = require('./tradeModel')
var Asset = require('../asset/assetModel')

var ErrorCollection = require('../../utils/errorCollection')



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
        validationResult(req).throw()
        let reqBody = req.body
        let assetExists = false

        reqBody.tradeType = "buy"

        let existingAsset = await Asset.findOne({ ticker: reqBody.ticker })
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
        reqBody.tradeType = "sell"
        
        let existingAsset = await Asset.findOne({ ticker: reqBody.ticker, assetType: reqBody.assetType })
        if(!existingAsset){
            let errRes = ErrorCollection.noAsset
            res.status(errRes.code).json(errRes)
            return
        }

        // ==== Checking is quantity being sold is not more than the quantity owned ====
        if(existingAsset.quantity < reqBody.quantity){
            let errRes = ErrorCollection.negativeQuantity
            res.status(errRes.code).json(errRes)
            return
        }

        let soldTrade = await Trade.create(reqBody)
        existingAsset.quantity = existingAsset.quantity - soldTrade.quantity

        // ==== Checking if Quantity of asset becomes empty in portfolio, it should be removed. ====
        if(existingAsset.quantity === 0){
            await Asset.findByIdAndRemove(existingAsset._id)
        }else{
            existingAsset.save() // non-blocking save 
        }
        

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
        let genericResponse= {message: "Trage Deleted Successfully"}
        
        let tradeDetails = await Trade.findById(reqParams.id).lean()
        let assetDetails = await Asset.findOne({ticker: tradeDetails.ticker})

        // ==== TODO: Throw error if asset details is not found ====

        if(tradeDetails.tradeType === "buy"){
            if(tradeDetails.quantity === assetDetails.quantity){
                // ==== NOTE: Delete asset from portfolio ====
                deleteAsset = true
            }else{
                // ==== Reseting Price and quantity of Asset from Portfolio ====
                assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) - (tradeDetails.amount * tradeDetails.quantity)) / (assetDetails.quantity - tradeDetails.quantity)
                assetDetails.quantity = (assetDetails.quantity - tradeDetails.quantity)
            }
        }
        else if(tradeDetails.tradeType === "sell"){
            // ==== NOTE: We have a loop hole here. If all the quantities of asset is sold, we will not have track of it's average price ====
            assetDetails.quantity = (assetDetails.quantity + tradeDetails.quantity)
        }

        // ==== Deleting Trade and updating Asset's values in portfolio ====
        await Trade.findByIdAndRemove(tradeDetails._id)
        if(deleteAsset){
            await Asset.findByIdAndRemove(assetDetails._id)
        }else{
            assetDetails.save()
        }

        
        res.json(genericResponse)

    }catch(err){
        next(err)
    }
}



// ==== Update Trade ====
exports.updateTrade = async(req, res, next) => {
    try{
        let reqParams = req.params
        let reqBody = req.body
        let newAssetDetails

        // ==== Fetch Details of old Trade & it's corrosponding asset ====
        let oldTrade = await Trade.findById(reqParams.id).lean()
        let assetDetails = await Asset.findOne({ticker: oldTrade.ticker})

        // ==== Common process of removing trade from Asset collection ====
        let oldTradeFactor = oldTrade.tradeType === "buy" ? -1 : 1
        let newTradeFactor = reqBody.tradeType === "buy" ? 1 : -1

        assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) + (oldTrade.amount * oldTrade.quantity * oldTradeFactor)) / (assetDetails.quantity + (oldTrade.quantity*oldTradeFactor))
        assetDetails.quantity = (assetDetails.quantity + (oldTrade.quantity*oldTradeFactor))
        console.log(assetDetails)

        // ==== check if the Ticker is same ====
        if(oldTrade.ticker === reqBody.ticker){

            // ==== Updating new trade details into Asset ====
            if(reqBody.tradeType === "buy"){
                assetDetails.averagePrice = ((assetDetails.averagePrice * assetDetails.quantity) + (reqBody.amount * reqBody.quantity * newTradeFactor)) / (assetDetails.quantity + (reqBody.quantity*newTradeFactor))
            }            
            assetDetails.quantity = (assetDetails.quantity + (reqBody.quantity*newTradeFactor))

            console.log(assetDetails)

            // ==== If the average price or quantity drops below 0, Throw errors ====
            if(assetDetails.averagePrice < 0 || assetDetails.quantity < 0){
                // === Throw error saying asset price or quantity is hitting below 0 ====
                console.log("Breaking below 0 barrier")
                let errRes = ErrorCollection.negativeQuantity
                res.status(errRes.code).json(errRes)
                return
            }

        }else{
            newAssetDetails = await Asset.findOne({ticker: reqBody.ticker})
            if(!newAssetDetails){
                let errRes = ErrorCollection.noAsset
                res.status(errRes.code).json(errRes)
                return
            }

            // ==== Updating new trade details into new Asset ====
            if(reqBody.tradeType === "buy"){
                newAssetDetails.averagePrice = ((newAssetDetails.averagePrice * newAssetDetails.quantity) + (reqBody.amount * reqBody.quantity * newTradeFactor)) / (newAssetDetails.quantity + (reqBody.quantity*newTradeFactor))
            }            
            newAssetDetails.quantity = (newAssetDetails.quantity + (reqBody.quantity*newTradeFactor))

            if(newAssetDetails.averagePrice < 0 || newAssetDetails.quantity < 0){
                // ==== Throw error ====
                console.log("Breaking below 0 barrier")
                let errRes = ErrorCollection.negativeQuantity
                res.status(errRes.code).json(errRes)
                return
            }
        }


        // ==== Final wrapping of assetDetails ====
        if(assetDetails.quantity < 0){
            // ==== Throw Error ====
            console.log("Breaking below 0 barrier")
            let errRes = ErrorCollection.negativeQuantity
            res.status(errRes.code).json(errRes)
            return
        }
        else if(assetDetails.quantity === 0){
            // ==== Remove asset from portfolio ====
            await Asset.findByIdAndRemove(assetDetails._id)
        }
        else{
            // ==== Save assetDetails ====
            assetDetails.save()
        }

        // ==== Saving newAssetDetails if the ticker in update was different ====
        if(newAssetDetails){
            newAssetDetails.save()
        }

        // ==== Updating the trade as requested if no error occures ====
        let updatedTrade = await Trade.findByIdAndUpdate(oldTrade._id, reqBody)

        res.json(updatedTrade)

    }catch(err){
        next(err)
    }
}



