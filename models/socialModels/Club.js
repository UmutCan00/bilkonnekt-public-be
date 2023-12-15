const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Club = Schema(
    {
        name:{
            type: String,
            required: true
        },
        executiveId:{
            type: String,
            required: false,
            default: "none",
        },
        imageURL:{
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
module.exports = mongoose.model('Club', Club)