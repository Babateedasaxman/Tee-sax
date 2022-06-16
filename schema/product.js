const mongoose = require("mongoose")

let productSchema = new mongoose.Schema({
    name: {type:String, unique:false, required:true},
    price:{type:Number, required:true},
    image:{type:String},
    description:{type:String, required:true},
    quantity:{type:Number, required:true}
})

module.exports = mongoose.model('products', productSchema)