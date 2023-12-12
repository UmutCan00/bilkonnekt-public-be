const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Post = Schema(
    {
        title:{
            type: String,
            required: true
        },
        publisherId:{
            type: String,
            required: true
        },
        content:{
            type: String,
            required: true
        },
        imageURL:{
            type: String,
            required: false,
            default: "none",
        },
        likeCount:{
            type: String,
            required: false,
            default: "none",
        },
        commentCount:{
            type: String,
            required: false,
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
module.exports = mongoose.model('Post', Post)