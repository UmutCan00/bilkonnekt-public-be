const Group = require('../models/studyGroupModels/Group')
const GroupAppplication = require('../models/studyGroupModels/GroupApplication')
const GroupParticipation = require('../models/studyGroupModels/GroupParticipation')
const GroupTask = require('../models/studyGroupModels/GroupTask')



async function createStudyGroup(req, res){
    const {groupName, description, courseCode } = req.body
    const user = req.user;
    const leaderId = user.id
    if( !groupName || !description || !courseCode|| !leaderId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const newGroup = await Group.create({groupName, description, courseCode})
        await GroupParticipation.create({groupId:newGroup.id,studentId: leaderId, role: "leader"});
        return res.status(201).json({message: "Succesfully created new product, basarili"})
    } catch (error) {
        return res.status(400).json({message: "Could not create new product, basarisiz"})
    }
}
async function seeUserGroups(req, res){
    const user = req.user;
    const userId= user.id;
    if( !userId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        participationResults= await GroupParticipation.find({studentId: userId}).sort({ date: -1 });
        const groupIds = participationResults.map(result => result.groupId);
        console.log('Group IDs:', groupIds);

        // Step 2: Query the Group schema with the obtained group IDs
        const groupResults = await Group.find({ _id: { $in: groupIds } });
        console.log('Group Results:', groupResults);
        return res.status(201).json(groupResults)
    } catch (error) {
        console.log("basarisiz", error);
        return res.status(400).json({message: "Could not get see User groups"})
    }
}
async function joinStudyGroup(req, res){

}
async function seeGroupParticipants(req, res){

}
async function promoteToLeader(req, res){

}
async function kickParticipant(req, res){

}
async function applyToStudyGroup(req, res){

}
async function assignGroupTask(req, res){

}
async function seeGroupTasks(req, res){

}
async function completeGroupTask(req, res){

}
async function leaveStudyGroup(req, res){

}
async function deleteStudyGroup(req, res){

}
module.exports = {createStudyGroup,seeUserGroups,joinStudyGroup,seeGroupParticipants,promoteToLeader
    , kickParticipant, applyToStudyGroup, assignGroupTask, seeGroupTasks, completeGroupTask, leaveStudyGroup,
    deleteStudyGroup}