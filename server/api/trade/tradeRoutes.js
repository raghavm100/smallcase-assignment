// ==== Libraries used ====
var router = require('express').Router()

// ==== Local modules used ====
var controller = require('./tradeController')
var tradeValidator = require('./tradeValidator')

// ==== Routes ====

router.route('/')
    .get(controller.fetchTrades)

router.route('/buy')
    .post(tradeValidator.checkBuyAsset, controller.buySecurity)

router.route('/sell')
    .post(tradeValidator.checkSellAsset, controller.sellSecurity)

router.route('/:id')
    .delete(tradeValidator.checkDeleteTrade, controller.deleteTrade)
    .patch(tradeValidator.checkUpdateTrade, controller.updateTrade)


module.exports = router