const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Contract = Schema(
    {
        dialogId:{
            type: String,
            required: true
        },
        returnLocation:{
            type: String,
            required: false,
            default: false,
        },
        returnDate:{
            type: String,
            required: false,
            default: false,
        },
        isSellerAccepted:{
            type: Boolean,
            required: false,
            default: false,
        },
        isBuyerAccepted:{
            type: Boolean,
            required: false,
            default: false,
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
module.exports = mongoose.model('Contract', Contract)