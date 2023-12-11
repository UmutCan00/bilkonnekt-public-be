const Message = require('../models/Message')

async function sendMessage(req,res){
    const {dialogId, description} = req.body
    const user = req.user;
    const senderId=user.id;
    if( !senderId || !dialogId || !description) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await Message.create({senderId: senderId, dialogId, description})
        return res.status(201).json({message: "Succesfully created new message, basarili"})
    } catch (error) {
        return res.status(400).json({message: "Could not create new message, basarisiz"})
    }
}


module.exports = {sendMessage}