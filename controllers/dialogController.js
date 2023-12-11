const Dialog = require('../models/Dialog')
const Message = require('../models/Message')



async function createDialog(req,res){
    const {itemId, sellerId} = req.body
    const user = req.user;
    const userId=user.id;
    if( !itemId || !sellerId || !userId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await Dialog.create({itemId, buyerId:userId, sellerId})
        return res.status(201).json({message: "Succesfully created new dialog, basarili"})
    } catch (error) {
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
module.exports = {createDialog,getDialogMessage,getDialogsOfUser}