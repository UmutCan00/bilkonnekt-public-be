const Dialog = require('../models/Dialog')
const Message = require('../models/Message')
const User = require('../models/User')
const Prod = require('../models/Product')
const Contract = require('../models/Contract')


async function createDialog(req,res){
    const {itemId, sellerId} = req.body
    const user = req.user;
    const userId=user.id;
    const buyerName = user.username;
    let dialogType = "Section Change" // by default
    if( !itemId || !sellerId || !userId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        const seller = await User.findOne({_id:sellerId});
        const sellerName = seller.username;
        try {
            const item = await Prod.findOne({_id:itemId})
            dialogType = item.title;
        } catch (error) {
            
        }
        await Dialog.create({itemId, buyerId:userId, sellerId, sellerName, buyerName, dialogType})
        return res.status(201).json({message: "Succesfully created new dialog, basarili"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Could not create new dialog, basarisiz"})
    }
}
async function getDialogMessage(req,res){
    const {dialogId} = req.body;
    try {
        results= await Message.find({dialogId:dialogId}).sort({ date: 1 });
        console.log(results);
        return res.status(201).json(results)
    } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Could not get dialog messages"})
    }
}

async function getDialogsOfUser(req,res){
    const user = req.user;
    const userId=user.id;
    console.log(userId)
    try {
        results= await Dialog.find({
            $or: [
            { sellerId: userId },
            { buyerId: userId }
          ]
        }).sort({ date: -1 });
        console.log(results);
        return res.status(201).json(results)
    } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Could not get user dialogs"})
    }
}

async function createContract(req,res){
    const {dialogId, returnLocation, returnDate} = req.body;
    if(!dialogId){
        return res.status(422).json({message: 'Invalid fields'})
    }
    try {
        const results= await Contract.create({dialogId, returnLocation, returnDate});
        console.log(results);
        return res.status(201).json({message: 'Contract create basarili'})
    } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Contract create basarisiz"})
    }
}

async function acceptContract(req,res){
    const {contractId} = req.body;
    const userId = req.user.id;
    if(!contractId||!userId){
        return res.status(422).json({message: 'Invalid fields'})
    }
    try {
        const currentContract = await Contract.findOne({_id:contractId});
        if(!currentContract){
            return res.status(404).json({message: 'contract not found'})
        }
        const dialogId = currentContract.dialogId;
        const currentDialog = await Dialog.findOne({_id:dialogId});
        if(!currentDialog){
            return res.status(404).json({message: 'contract -> dialog not found'})
        }
        if(currentDialog.sellerId == userId && !currentContract.isSellerAccepted){
            await Contract.findOneAndUpdate(
                { _id: contractId},
                { $set: { isSellerAccepted: true } }
            );
        }else if(currentDialog.buyerId == userId){
            await Contract.findOneAndUpdate(
                { _id: contractId},
                { $set: { isBuyerAccepted: true } }
            );
        }else{
            return res.status(403).json({message: 'You are not allowed'})
        }
        return res.status(201).json({message: 'Contract accepted basarili'})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Contract accept basarisiz"})
    }
}

async function getDialogContracts(req,res){
    const {dialogId} = req.body;
    if(!dialogId){
        return res.status(422).json({message: 'Invalid fields'})
    }
    try {
        const results = await Contract.find({dialogId:dialogId});
        return res.status(201).json({results})
    } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Contract create basarisiz"})
    }
}
module.exports = {createDialog,getDialogMessage,getDialogsOfUser,createContract, acceptContract, getDialogContracts}