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

        let totalAssets = await Asset.find({}).countDocuments()
        let allReturns = await Asset.aggregate([
            {$sort: {createdAt: -1}},
            {$skip: offset},
            {$limit: limit},
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
                    quantity: 1, totalReturn: 1,
                    createdAt: 1
                }
            }
        ])

        /*
            ====
            We have sorted, limited and skipped in the aggregation
            pipeline in the begining itself because we do not have 
            to filter data by any pattern (by matching something.) 

            So, we have filtered and cut down data in the begining of the 
            pipeline itself. 
            ====
        */

        let resObj = {
            totalCount: totalAssets,
            totalPages: Math.ceil(totalAssets / limit),
            pageCount: (limit + offset) / limit,
            assetList: allReturns
        }

        res.json(resObj)
    }catch(err){
        next(err)
    }
}


// ==== Fetch Cumulative returns & investment ====
exports.fetchCumulativeReturns = async (req, res, next) => {
    try{
        let resObj = {}

        // ==== Aggregate query to group and sum all Asset Investments and Returns from Portfolio ====
        let allReturns = await Asset.aggregate([
            {
                $group: {
                    _id: "",
                    totalInvestment: { $sum: {
                        $multiply: ["$averagePrice", "$quantity"]
                    }},
                    cumulativeReturn: { $sum: {"$multiply": [
                            {"$add": ["$averagePrice", -100]},
                            "$quantity"
                        ]} 
                    } 
                }
            },
            {
                $project: {
                    _id: 0,
                    cumulativeReturn: 1, totalInvestment: 1
                }
            }
        ])

        // ==== Building response as per query response ====
        if(allReturns.length === 0){
            resObj.message = "Portfolio is empty"
        }else{
            resObj = allReturns[0]
        }

        res.json(resObj)
    }catch(err){
        next(err)
    }
}


