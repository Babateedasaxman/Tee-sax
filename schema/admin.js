const mongoose = require("mongoose")

let adminSchema = new mongoose.Schema({
   Fullname:{type:String},
   Email:{type:String, required:true, unique:true},
   Username:{type:String, required:true,unique:true},
   Password:{type:String, required:true},
      
})



const adminModel =  mongoose.model('admin', adminSchema)

module.exports = adminModel
