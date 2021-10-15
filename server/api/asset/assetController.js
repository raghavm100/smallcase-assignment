// ==== Libraries used ====

// ==== Local Modules used ====
var Asset = require('./assetModel')
var ErrorCollection = require('../../utils/errorCollection')



// ==== Fetch Portfolio ====
exports.fetchPortfolio = async(req, res, next) => {
    try{
        let reqQuery = req.query
        let limit = parseInt(reqQuery.limit) || 10
        let offset = parseInt(reqQuery.offset) || 0

        let totalAssets = await Asset.find({}).countDocuments()
        let assetList = await Asset.find()
            .sort({createdAt: -1})
            .limit(limit)
            .skip(offset)

        let resObj = {
            totalCount: totalAssets,
            totalPages: Math.ceil(totalAssets / limit),
            pageCount: (limit + offset) / limit,
            assetList: assetList
        }

        res.json(resObj)
        
    }catch(err){
        next(err)
    }
}



// ==== Fetch Returns ====
exports.fetchReturns = async(req, res, next) => {
    try{
        let reqQuery = req.query
        let limit = parseInt(reqQuery.limit) || 10
        let offset = parseInt(reqQuery.offset) || 0

        let allReturns = await Asset.aggregate([
            { $addFields: { 
                totalReturn: {
                    "$multiply": [
                        {"$add": ["$averagePrice", -100]},
                        "$quantity"
                    ]                    
                }
            } },
            {
                $project: {
                    ticker: 1, averagePrice: 1,
                    quantity: 1, totalReturn: 1
                }
            }
        ])

        res.json(allReturns)
    }catch(err){
        next(err)
    }
}


