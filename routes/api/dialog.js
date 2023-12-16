const express = require('express')
const router = express.Router()
const dialogControllers = require('../../controllers/dialogController')
const authMiddleware = require('../../middleware/auth')


router.post('/createDialog',authMiddleware, dialogControllers.createDialog)

router.post('/getDialogMessage',authMiddleware, dialogControllers.getDialogMessage)

router.get('/getDialogsOfUser',authMiddleware, dialogControllers.getDialogsOfUser)

router.post('/createContract',authMiddleware, dialogControllers.createContract)

router.post('/acceptContract',authMiddleware, dialogControllers.acceptContract)

router.post('/getDialogContracts',authMiddleware, dialogControllers.getDialogContracts)
module.exports = router