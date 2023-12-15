const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Follower = Schema(
    {
        studentId:{
            type: String,
            required: true
        },
        clubId:{
            type: String,
            required: false,
            default: "none",
        },
        role:{
            type: String,
            required: false,
            default: "participant",
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
module.exports = mongoose.model('Follower', Follower)