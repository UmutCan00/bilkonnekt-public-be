const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Comment = Schema(
    {
        postId:{
            type: String,
            required: true
        },
        commenterId:{
            type: String,
            required: true
        },
        commenterName:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true,
            default: "none",
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
module.exports = mongoose.model('Comment', Comment)