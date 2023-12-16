const express = require('express')
const router = express.Router()
const socialControllers = require('../../controllers/socialController')
const authMiddleware = require('../../middleware/auth')


router.post('/createSocialPost', authMiddleware, socialControllers.createSocialPost)

router.get('/getSocialPosts', socialControllers.getSocialPosts)

router.post('/getSingleSocialPost', socialControllers.getSingleSocialPost)

router.post('/createComment', socialControllers.createComment)

router.post('/getPostComments', socialControllers.getPostComments)

router.post('/updateComment', socialControllers.updateComment)

router.post('/likePost', socialControllers.likePost)

router.post('/createClubPost', socialControllers.createClubPost)

router.post('/createClub', socialControllers.createClub)

router.post('/followClub', socialControllers.followClub)

router.get('/getClubs', socialControllers.getClubs)

router.get('/getLikedPostsOfUser', authMiddleware, socialControllers.getLikedPostsOfUser);

router.post('/updatePost', authMiddleware, socialControllers.updatePost);

router.post('/deletePost', authMiddleware, socialControllers.deletePost);
module.exports = router