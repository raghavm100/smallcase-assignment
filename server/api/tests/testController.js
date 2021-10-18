// ==== Libraries used ====

// ==== Local Modules used ====
var Asset = require('../asset/assetModel')
var Trade = require('../trade/tradeModel')


// ==== Controller methods ====

// ==== Basic health check ====
exports.clearDatabase = async(req, res, next) => {
    try{
        let resObj = {}

        await Asset.remove({})
        await Trade.remove({})

        resObj.message = "Asset and Trade collections cleared"
        res.json(resObj)
    }catch(err){
        next(err)
    }
}

