// ==== Libraries used ====
var router = require('express').Router()

// ==== Local modules used ====
var controller = require('./tradeController')

// ==== Routes ====

router.route('/')
    .get(controller.fetchTrades)

router.route('/buy')
    .post(controller.buySecurity)

router.route('/sell')
    .post(controller.sellSecurity)

router.route('/:id')
    .delete(controller.deleteTrade)
    .patch(controller.updateTrade)


module.exports = router