const express = require('express')
const router = express.Router()
const authControllers = require('../../controllers/authController')
const authMiddleware = require('../../middleware/auth')


router.post('/register', authControllers.register)

router.post('/login', authControllers.login)

router.post('/logout', authControllers.logout)

router.post('/refresh', authControllers.refresh)

router.get('/user', authMiddleware, authControllers.user)

router.post('/prereg', authControllers.prereg)

router.post('/getProfile', authControllers.getProfile)

router.post('/deleteUser', authMiddleware, authControllers.deleteUser)

router.post('/changePassword', authMiddleware, authControllers.changePassword)

router.post('/updateImage', authMiddleware, authControllers.updateImage)

router.get('/getUsers', authMiddleware, authControllers.getUsers)

router.post('/updateRole', authMiddleware, authControllers.updateRole)

router.post('/banStasusChange', authMiddleware, authControllers.banStasusChange)

router.post('/createTicket', authMiddleware, authControllers.createTicket)

router.get('/getTickets', authControllers.getTickets)

router.post('/handleTicket', authControllers.handleTicket)
module.exports = router