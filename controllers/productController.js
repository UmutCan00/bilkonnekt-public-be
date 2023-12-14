const Product = require('../models/Product')


async function createProduct(req, res){
  const {title, price, address, type, description, imageURL} = req.body
  const user = req.user;
  if( !title || !price || !address || !type || !description || !imageURL) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      await Product.create({sellerid: user.id, title, price, address, type, description, imageURL})
      return res.status(201).json({message: "Succesfully created new product, basarili"})
    } catch (error) {
      return res.status(400).json({message: "Could not create new product, basarisiz"})
    }
}

async function getProducts(req,res){
  try {
    results= await Product.find().sort({ date: -1 });
    console.log(results);
    return res.status(201).json(results)
  } catch (error) {
    console.log("basarisiz");
    return res.status(400).json({message: "Could not get product items"})
  }
}

async function getProductsByUserId(req,res){
  try {
    console.log(req)
    results= await Product.find({sellerid: req.query.userId}).sort({ date: -1 });
    console.log(results);
    return res.status(201).json(results)
  } catch (error) {
    console.log("basarisiz");
    return res.status(400).json({message: "Could not get product items by user id"})
  }
}

module.exports = {createProduct, getProducts, getProductsByUserId}