const express = require('express')
const router = express.Router()
const Product = require('../../controllers/productController')// TODO
const authMiddleware = require('../../middleware/auth')

router.post('/createProduct', authMiddleware, Product.createProduct) // real create
module.exports = router