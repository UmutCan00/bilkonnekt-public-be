const Product = require('../models/Product')
const User = require('../models/User')


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
    
    for (let i = 0; i < results.length; i++) {
      const sellerid = results[i].sellerid;

      // Satıcı adını alalım
      const seller = await User.findOne({ _id: sellerid });

      // Eğer satıcı bulunursa, ürünün sellerName özelliğine ekle
      if (seller) {
        console.log("seller: ",seller)
        results[i] = results[i].toObject(); // MongoDB dökümanını plain JavaScript objesine dönüştür
        results[i].sellerName = seller.username; // Satıcı adını ekle
      }
    } 
    return res.status(201).json(results)
  } catch (error) {
    console.log("basarisiz: ", error);
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

async function deleteProduct(req,res){
  const {productId} = req.body
  const userId = req.user.id;
  if( !productId || !userId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      const item = await Product.findOne({_id: productId})
      if(!item){
        return res.status(404).json({'message': 'Product not found'})
      }
      if(item.sellerid != userId){
        return res.status(400).json({'message': 'You are not allowed to do this operation'})
      }

      await item.deleteOne();
      
      return res.status(201).json({message: "Succesfully deleted the product, basarili"})
    } catch (error) {
      console.log(error);
      return res.status(400).json({message: "Could not deleted the product, basarisiz"})
    }
}

async function getSingleProductById(req,res){
  const {productId} = req.body
  const userId = req.user.id;
  if( !productId || !userId) {
      return res.status(422).json({'message': 'Invalid fields'})
  }

  try {
      const item = await Product.findOne({_id: productId})
      if(!item){
        return res.status(404).json({'message': 'Product not found'})
      }
      
      return res.status(201).json(item)
    } catch (error) {
      console.log(error);
      return res.status(400).json({message: "Could not fetch the product, basarisiz"})
    }
}

module.exports = {createProduct, getProducts, getProductsByUserId, deleteProduct, getSingleProductById}