const mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
   Surname: {type:String, required:true},
   Firstname:{type:String, required:true},
   Fullname:{type:String},
   Email:{type:String, required:true, unique:true},
   Address:{type:String, required:true},
   Phoneno:{type:Number, required:true},
   Username:{type:String, required:true,unique:true},
   Password:{type:String, required:true},
   cart:[{type:mongoose.Schema.Types.ObjectId, ref:'products'}],
   quantity:[{type:Number}],
   order: [{type:mongoose.Schema.Types.ObjectId, ref:'order'}]
})



const userModel =  mongoose.model('user', userSchema)

module.exports = userModel
