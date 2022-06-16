const mongoose = require("mongoose")

let orderSchema = new mongoose.Schema({
    products: [{type:mongoose.Schema.Types.ObjectId, ref:'products'}],
    price:{type:Number, required:true},
    buyersName:{type:String, required:true},
    buyersAddress:{type:String, required:true},
    buyersPhoneNo:{type:Number},
    quantity:[{type:Number, required:true}],
    delivered:{type:Boolean}
})

module.exports = mongoose.model('order', orderSchema)
