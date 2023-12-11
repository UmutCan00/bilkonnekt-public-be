const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Message = Schema(
    {
        senderId:{
            type: String,
            required: true
        },
        dialogId:{
            type: String,
            required: true
        },
        description:{
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
module.exports = mongoose.model('Message', Message)