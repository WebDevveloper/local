const router = require('express').Router()

router.use('/auth', require('./authRoute'))
router.use('/orders', require('./ordersRoute'))
router.use('/services', require('./serviceRoute'))

module.exports = router;