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
        results= await Contract.create({dialogId, returnLocation, returnDate});
        console.log(results);
        return res.status(201).json({message: 'Contract create basarili'})
    } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Contract create basarisiz"})
    }
}
module.exports = {createDialog,getDialogMessage,getDialogsOfUser,createContract}