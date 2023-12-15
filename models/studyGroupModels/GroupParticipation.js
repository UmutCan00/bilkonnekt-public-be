const mongoose = require('mongoose')

const Schema = mongoose.Schema
const GroupParticipation = Schema(
    {
        groupId:{
            type: String,
            required: true
        },
        studentId:{
            type: String,
            required: true
        },
        role:{
            type: String,
            required: true,
            default: "participant"
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
module.exports = mongoose.model('GroupParticipation', GroupParticipation)