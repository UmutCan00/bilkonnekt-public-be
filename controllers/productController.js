const Product = require('../models/Product')


async function createProduct(req, res){
    const {sellerid, title, price, address, type, description, imageURL} = req.body

    if(!sellerid || !title || !price || !address || !type || !description || !imageURL) {
        return res.status(422).json({'message': 'Invalid fields'})
    }

    try {
        await Product.create({sellerid, title, price, address, type, description, imageURL})
        return res.status(201).json({message: "Succesfully created new product, basarili"})
      } catch (error) {
        return res.status(400).json({message: "Could not create new product, basarisiz"})
      }

    return res.status(200).json({message: "basarili"})
}

module.exports = {createProduct}