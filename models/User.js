const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = Schema(
  {
    username:{
      type: String,
      required: true
    },

    email:{
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [
        (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
      ]
    },
    password: {
      type: String,
      required: true,
      min: 6
    },
    imageURL: {
      type: String,
      required: false,
      default: "https://firebasestorage.googleapis.com/v0/b/bilkonnekt.appspot.com/o/images%2Fpppng.png322ad555-cfe0-4c9f-9f30-6d4d398f9a1b?alt=media&token=d0806a7d-3222-438b-8f22-9a7a197b664f" 
    },
    refresh_token: String
  },
  {
    virtuals:{
      full_name: {
        get(){
          return this.first_name + ' ' + this.last_name
        }
      },

      id: {
        get(){
          return this._id
        }
      }
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  },
  
)

module.exports = mongoose.model('User', UserSchema)