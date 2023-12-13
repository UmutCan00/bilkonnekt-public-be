const express = require('express')
const router = express.Router()
const socialControllers = require('../../controllers/socialController')
const authMiddleware = require('../../middleware/auth')


router.post('/createSocialPost', authMiddleware, socialControllers.createSocialPost)

router.get('/getSocialPosts', socialControllers.getSocialPosts)

router.post('/getSingleSocialPost', socialControllers.getSingleSocialPost)

module.exports = router