const Dialog = require('../models/Dialog')
const Message = require('../models/Message')



async function createDialog(req,res){
    const {itemId, sellerId, buyerId} = req.body
    
    if( !itemId || !sellerId || !buyerId) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await Dialog.create({itemId, sellerId, buyerId})
        return res.status(201).json({message: "Succesfully created new dialog, basarili"})
    } catch (error) {
        return res.status(400).json({message: "Could not create new dialog, basarisiz"})
    }
}
async function getDialogMessage(req,res){
    const {dialogId} = req.body;
    try {
        results= await Message.find({dialogId:dialogId}).sort({ date: -1 });
        console.log(results);
        return res.status(201).json(results)
      } catch (error) {
        console.log("basarisiz");
        return res.status(400).json({message: "Could not get dialog messages"})
      }
}

module.exports = {createDialog,getDialogMessage}