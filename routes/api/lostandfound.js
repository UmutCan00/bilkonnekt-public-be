const express = require('express')
const router = express.Router()
const lostItemController = require('../../controllers/lostItemController')
const authMiddleware = require('../../middleware/auth')


router.post('/createItem', authMiddleware,lostItemController.createItem)

router.get('/getItems', lostItemController.getItems)

module.exports = router