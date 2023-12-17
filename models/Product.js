const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Product = Schema(
    {
        sellerid:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        sellerName:{
            type: String,
            required: false,
            default:"BilkonnektUser"
        },
        price: {
            type: Number,
            required: false,
            default:0
        },
        duration: {
            type: Number,
            required: false,
            default:0
        },
        address:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        imageURL:{
            type: String,
            required: true
        },
        date:{
            type: Date, 
            default: Date.now,
            required:false
        }
    },
    {
        virtuals:{
            id: {
            get(){
                return this._id
            }
            }
        },
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    },
)
module.exports = mongoose.model('Product', Product)