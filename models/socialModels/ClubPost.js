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
        content:{
            type: String,
            required: true
        },
        location:{
            type: String,
            required: true
        },
        imageURL:{
            type: String,
            required: false,
            default: "none",
        },
        eventDate:{
            type:Date,
            required:true
        },
        eventhour:{
            type:String,
            required:true
        },
        points:{
            type:Number,
            required:true
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