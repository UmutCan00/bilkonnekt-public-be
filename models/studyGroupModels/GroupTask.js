const mongoose = require('mongoose')

const Schema = mongoose.Schema
const GroupTask = Schema(
    {
        description:{
            type: String,
            required: true
        },
        names: {
            type: [String], 
            required: true,
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