const express = require('express')
const router = express.Router()
const Product = require('../../controllers/productController')// TODO
const authMiddleware = require('../../middleware/auth')

//router.post('/createProduct', authMiddleware, Product.createProduct) // real create
router.post('/createProduct',  Product.createProduct); // for dev purposes
module.exports = router