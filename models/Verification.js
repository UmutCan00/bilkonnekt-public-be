const mongoose = require('mongoose')

const Schema = mongoose.Schema

const VerificationSchema = Schema(
  {
    user_email:{
      type: String,
      required: true
    },
    verificationcode: {
      type: Number,
      required: true,
    },
    
  },
  
)

module.exports = mongoose.model('Verification', VerificationSchema)