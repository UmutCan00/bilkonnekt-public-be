const mongoose = require('mongoose')

const Schema = mongoose.Schema
const SectionChange = Schema(
    {
        courseCode:{
            type: String,
            required: true
        },
        userId:{
            type: String,
            required: true
        },
        currentSection: {
            type: Number, 
            required: true,
        },
        aimedSection: {
            type: Number, 
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
module.exports = mongoose.model('SectionChange', SectionChange)