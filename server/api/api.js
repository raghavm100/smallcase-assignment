// ==== Libraries used ====
var router = require('express').Router()

// ==== Local Modules used ====
var tradeRoutes = require('./trade/tradeRoutes')
var assetRoutes = require('./asset/assetRoutes')


// ==== Routing internally ====
router.use('/trades', tradeRoutes)
router.use('/assets', assetRoutes)




// ==== Default case ====
router.use((req, res, next) => {
    console.log("!!!! Invalid API endpoint hit !!!!")
    // ==== TODO: Add Error case for invalid API endpoint ====
    res.end("Recheck Endpoint")
})

module.exports = router