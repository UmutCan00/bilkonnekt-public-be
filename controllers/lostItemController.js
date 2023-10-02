const LostItemAd = require('../models/LostItemAd')



async function createItem(req, res){
    const {foundedPlace, lostObjDescription, deliveredPlace} = req.body
  
    console.log("foundedPlace: ",foundedPlace," lostObjDescription: ", lostObjDescription, " deliveredPlace: ", deliveredPlace)
    if(!foundedPlace || !lostObjDescription || !deliveredPlace) {
      return res.status(422).json({'message': 'Invalid fields'})
    }
    try {
      await LostItemAd.create({foundedPlace:foundedPlace, description:lostObjDescription, deliveredPlace: deliveredPlace})
      return res.sendStatus(201)
    } catch (error) {
      return res.status(400).json({message: "Could not create lost item"})
    }
}

async function getItems(req, res){
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    try {
        results= await LostItemAd.find({ date: { $gte: oneMonthAgo } }).sort({ date: -1 });
        console.log(results)
      return res.status(201).json(results)
    } catch (error) {
      return res.status(400).json({message: "Could not get lost items"})
    }
}

module.exports = {createItem,getItems}