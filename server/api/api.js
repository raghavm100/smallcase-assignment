// ==== Libraries used ====
var router = require('express').Router()

// ==== Local Modules used ====
var ErrorCollection = require('../utils/errorCollection')

var tradeRoutes = require('./trade/tradeRoutes')
var assetRoutes = require('./asset/assetRoutes')
var healthRoutes = require('./health/healthRoutes')
var testRoutes = require('./tests/testRoutes')


// ==== Routing internally ====
router.use('/trades', tradeRoutes)
router.use('/assets', assetRoutes)
router.use('/health', healthRoutes)
router.use('/tests', testRoutes)



// ==== Default case ====
router.use((req, res, next) => {
    let errRes = ErrorCollection.invalidEndpoint
    res.status(errRes.code).json(errRes)
})

module.exports = router