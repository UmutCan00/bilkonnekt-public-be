const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ClubPost = Schema(
    {
        title:{
            type: String,
            required: true
        },
        clubId:{
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
            type: Number,
            required: false,
            default: 0,
        },
        commentCount:{
            type: Number,
            required: false,
            default: 0,
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
module.exports = mongoose.model('ClubPost', ClubPost)