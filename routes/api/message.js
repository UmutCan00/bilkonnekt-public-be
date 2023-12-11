const express = require('express')
const router = express.Router()
const messageControllers = require('../../controllers/messageController')
const authMiddleware = require('../../middleware/auth')


router.post('/sendMessage',authMiddleware, messageControllers.sendMessage)

//router.post('/getDialogMessage',authMiddleware, messageControllers.getDialogMessage)

module.exports = router