// ==== Libraries used ====
var router = require('express').Router()

// ==== Local modules used ====
var controller = require('./assetController')

// ==== Routes ====

router.route('/')
    .get(controller.fetchPortfolio)

router.route('/returns')
    .get(controller.fetchReturns)

router.route('/cumulative-returns')
    .get(controller.fetchCumulativeReturns)


module.exports = router