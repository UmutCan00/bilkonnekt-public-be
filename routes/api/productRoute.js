const express = require('express')
const router = express.Router()
const Product = require('../../controllers/productController')// TODO
const authMiddleware = require('../../middleware/auth')

router.post('/createProduct', authMiddleware, Product.createProduct) // real create
//router.get('/getProducts', authMiddleware, Product.getProducts) // real create
router.get('/getProducts', Product.getProducts) // for dev purposes
router.get('/getProductsByUserId', Product.getProductsByUserId) // for dev purposes

module.exports = router