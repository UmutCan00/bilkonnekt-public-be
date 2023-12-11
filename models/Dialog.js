const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Dialog = Schema(
    {
        itemId:{
            type: String,
            required: true
        },
        sellerId:{
            type: String,
            required: true
        },
        buyerId:{
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
module.exports = mongoose.model('Dialog', Dialog)