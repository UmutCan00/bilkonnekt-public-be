const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Like = Schema(
    {
        postId:{
            type: String,
            required: true
        },
        userId:{
            type: String,
            required: true
        },
        isActive:{
            type: Boolean,
            required: false,
            default: true,
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
module.exports = mongoose.model('Like', Like)