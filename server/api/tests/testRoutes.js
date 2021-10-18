// ==== Libraries used ====
var router = require('express').Router()

// ==== Local modules used ====
var controller = require('./testController')

// ==== Routes ====

router.route('/delete-collections')
    .delete(controller.clearDatabase)


module.exports = router