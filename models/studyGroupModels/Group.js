const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Group = Schema(
    {
        groupName:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        courseCode:{
            type: String,
            required: true,
            uppercase: true,
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
module.exports = mongoose.model('Group', Group)