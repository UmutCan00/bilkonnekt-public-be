const mongoose = require('mongoose')

const Schema = mongoose.Schema
const GroupApplication = Schema(
    {
        groupId:{
            type: String,
            required: true
        },
        senderId:{
            type: String,
            required: true
        },
        senderEmail:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true,
        },
        isFinalized:{
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
module.exports = mongoose.model('GroupApplication', GroupApplication)