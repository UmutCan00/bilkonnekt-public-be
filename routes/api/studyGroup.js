const express = require('express')
const router = express.Router()
const groupControllers = require('../../controllers/groupManager')
const authMiddleware = require('../../middleware/auth')

router.post('/createStudyGroup', authMiddleware, groupControllers.createStudyGroup)

router.get('/seeUserGroups', authMiddleware, groupControllers.seeUserGroups)

router.post('/joinStudyGroup', authMiddleware, groupControllers.joinStudyGroup)

router.post('/seeGroupParticipants', authMiddleware, groupControllers.seeGroupParticipants)

router.post('/promoteToLeader', authMiddleware, groupControllers.promoteToLeader)

router.post('/kickParticipant', authMiddleware, groupControllers.kickParticipant)

router.post('/applyToStudyGroup', authMiddleware, groupControllers.applyToStudyGroup)

router.post('/assignGroupTask', authMiddleware, groupControllers.assignGroupTask)

router.post('/seeGroupTasks', authMiddleware, groupControllers.seeGroupTasks)

router.post('/completeGroupTask', authMiddleware, groupControllers.completeGroupTask)

router.post('/leaveStudyGroup', authMiddleware, groupControllers.leaveStudyGroup)

router.post('/deleteStudyGroup', authMiddleware, groupControllers.deleteStudyGroup)
module.exports = router