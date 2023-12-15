const mongoose = require('mongoose')

const Schema = mongoose.Schema
const GroupTask = Schema(
    {
        description:{
            type: String,
            required: true
        },
        groupId: {
            type: String, 
            required: true,
        },
        studentId: {
            type: String, 
            required: true,
        },
        isFinished:{
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
module.exports = mongoose.model('GroupTask', GroupTask)