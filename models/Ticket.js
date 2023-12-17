const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Ticket = Schema(
    {
        senderId:{
            type: String,
            required: true
        },
        senderName:{
            type: String,
            required: true
        },
        message:{
            type: String,
            required: true
        },
        isResponded:{
            type: Boolean,
            required: false,
            default: false
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
module.exports = mongoose.model('Ticket', Ticket)