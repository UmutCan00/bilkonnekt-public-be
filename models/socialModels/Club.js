const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Club = Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
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
            default: "https://firebasestorage.googleapis.com/v0/b/bilkonnekt-ef5da.appspot.com/o/images%2Fpppng.png1c618d29-fbbe-4ace-bfc7-f6b7ad7e0909?alt=media&token=6e649dcb-0451-46d9-96a1-61931df93f94",
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