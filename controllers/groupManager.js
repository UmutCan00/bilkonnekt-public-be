const Group = require('../models/studyGroupModels/Group')
const GroupApplication = require('../models/studyGroupModels/GroupApplication')
const GroupAppplication = require('../models/studyGroupModels/GroupApplication')
const GroupParticipation = require('../models/studyGroupModels/GroupParticipation')
const GroupTask = require('../models/studyGroupModels/GroupTask')
const User = require('../models/User')


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
    const {groupId } = req.body
    const user = req.user;
    const userId = user.id
    if( !groupId || !userId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const groupResults = await GroupParticipation.findOne({ studentId: userId, groupId:groupId });
        console.log("groupResults: ",groupResults);
        if(groupResults != null){
            return res.status(403).json({message: "You are already in the group, ses deneme"})
        }
        await GroupParticipation.create({groupId:groupId,studentId: userId, role: "participant"});
        return res.status(201).json({message: "Succesfully joined group, basarili"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Could not joined group, basarisiz"})
    } 
}
async function seeGroupParticipants(req, res){
    const {groupId } = req.body
    const user = req.user;
    const userId= user.id;
    if( !userId, !groupId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        participationResults= await GroupParticipation.find({groupId: groupId}).sort({ date: -1 });
        const studentIds = participationResults.map(result => result.studentId);
        console.log('Group IDs:', studentIds);
        const userResults = await User.find({ _id: { $in: studentIds } });
        console.log('User Results:', userResults);
        return res.status(201).json(userResults)
    } catch (error) {
        console.log("basarisiz", error);
        return res.status(400).json({message: "Could not get see Users in the group"})
    }
}
async function promoteToLeader(req, res){
    const {groupId, futureLeaderId } = req.body
    const user = req.user;
    const userId= user.id;
    if( !userId, !groupId, !futureLeaderId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }
    try {
        const futureleader= await GroupParticipation.findOne({studentId: futureLeaderId, groupId: groupId});
        const currentleader= await GroupParticipation.findOne({studentId: userId, groupId: groupId, role: "leader"});
        if(!futureleader,!currentleader ){
            return res.status(422).json({'message': 'No authority or no such user'})
        }
        await GroupParticipation.findOneAndUpdate(
            { studentId: futureLeaderId, groupId: groupId },
            { $set: { role: 'leader' } },
            { new: true }
        );
        return res.status(201).json({'message': 'Promote successful'})
    } catch (error) {
        console.log("basarisiz", error);
        return res.status(400).json({message: "Could not promote"})
    }
}
async function kickParticipant(req, res){
    const {groupId, futureKickedId } = req.body
    const user = req.user;
    const userId= user.id;
    if( !userId, !groupId, !futureKickedId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }
    try {
        const futurekicked= await GroupParticipation.findOne({studentId: futureKickedId, groupId: groupId});
        const currentleader= await GroupParticipation.findOne({studentId: userId, groupId: groupId, role: "leader"});
        if(!futurekicked,!currentleader ){
            return res.status(422).json({'message': 'No authority or no such user'})
        }
        
        await GroupParticipation.findOneAndRemove({ studentId: futureKickedId, groupId: groupId });
        return res.status(201).json({'message': 'Kick successful'})
    } catch (error) {
        console.log("basarisiz", error);
        return res.status(400).json({message: "Could not kicked"})
    }
}
async function applyToStudyGroup(req, res){
    const {groupId, description } = req.body
    const user = req.user;
    const userId = user.id;
    const useremail = user.email;
    if( !groupId || !description || !userId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }
    try {
        const currentuser= await GroupParticipation.findOne({studentId: userId, groupId: groupId,});
        if(currentuser){
            return res.status(422).json({'message': 'User Already in the group'})
        }
        await GroupApplication.create({groupId, senderId: userId, senderEmail: useremail,
            description})
        return res.status(201).json({message: "Succesfully created group applciation, basarili"})
    } catch (error) {
        return res.status(400).json({message: "Could not create group applciation, basarisiz"})
    }
}

async function assignGroupTask(req, res){
    const {groupId, description, assignedId} = req.body
    const user = req.user;
    const leaderId = user.id
    if( !groupId || !description || !leaderId || !assignedId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const currentuser= await GroupParticipation.findOne({studentId: leaderId, groupId: groupId,role:"leader"});
        if(!currentuser){
            return res.status(422).json({'message': 'You are not leader'})
        }
        await GroupTask.create({groupId, description, studentId: assignedId})
        return res.status(201).json({message: "Succesfully created new group task, basarili"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not create new group task, basarisiz"})
    }
}
async function seeGroupTasks(req, res){
    const {groupId} = req.body
    const user = req.user;
    const userId = user.id
    if( !groupId || !userId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const currenttasks= await GroupTask.find({ groupId: groupId, isFinished:false});
        return res.status(201).json(currenttasks)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Could not create new group task, basarisiz"})
    }
}
async function completeGroupTask(req, res){
    const {taskId} = req.body
    const user = req.user;
    const userId = user.id
    if( !taskId || !userId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const currenttask= await GroupTask.findOne({ _id: taskId});
        if(taskId != currenttask.id){
            return res.status(422).json({'message': 'This task is not assigned to you'})
        }
        console.log(currenttask)
        await GroupTask.findOneAndUpdate(
            { _id: taskId},
            { $set: { isFinished: true } }
        );
        return res.status(201).json({message: "task completed success"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "task completed fail"})
    }
}
async function leaveStudyGroup(req, res){
    const {groupId } = req.body
    const user = req.user;
    const userId = user.id
    if( !groupId || !userId ) {
        return res.status(422).json({'message': 'Invalid fields'})
    }
    try {
        const groupResults = await GroupParticipation.findOne({ studentId: userId, groupId:groupId });
        console.log("groupResults: ",groupResults);
        if(!groupResults){
            return res.status(403).json({message: "You are not in the group, ses deneme"})
        }
        await GroupParticipation.findOneAndRemove({groupId:groupId,studentId: userId});
        return res.status(201).json({message: "Succesfully leaved group, basarili"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Could not leaved group, basarisiz"})
    } 
}

module.exports = {createStudyGroup,seeUserGroups,joinStudyGroup,seeGroupParticipants,promoteToLeader
    , kickParticipant, applyToStudyGroup, assignGroupTask, seeGroupTasks, completeGroupTask, leaveStudyGroup}