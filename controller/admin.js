const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const orders = require("../schema/orders");
const product = require("../schema/product")
const formidable = require("express-formidable")


router.get("/admin",async(req,res)=>{
    const items = await product.find()
 res.render("admin-page",{items})

})
router.post("/create-product",formidable(), async(req,res)=>{
    try {
        const {description,name,price,quantity} = req.fields
        const image = '/media/' + req.files.image.name
        const oldPath =  req.files.image.path
        const date = new Date().toString()
        const newPath = path.resolve(__dirname,'..//public/media/'+ req.files.image.name)
            if(!fs.existsSync(newPath)){
                fs.renameSync(oldPath,newPath)
    
        
            const newProduct = new product({description,image,name,price,date,quantity})
            await newProduct.save()
            console.log(newProduct)
            res.redirect('admin')
            }
    
} catch (error) {
         console.error(error)}

})

router.get('/editSingle/:id', async (req,res)=>{
    try {
        const single = product.findById(req.params.id)
         res.render('edit-single-item',{single})
         console.log(single)
    } catch (error) {
        
    }
})
router.put("/editSingle/:id", async(req,res)=>{
    try {
        const one = await product.findById(req.params.id)
        let{description,name,price} = req.body
        one.description = description
        one.name = name;
        one.price = price 
        await one.save()
        res.render('success',{message:'you successfully updated an item',url:'/admin/admin'})
    } catch (error) {
        console.error(error)
    }
})
// transfer to own file
router.post('/Makeorders',async(req,res)=>{
    
    try {
            const {product,buyersName,buyersAddress,quantity,price}= req.body; 
        price = price * quantity
        let newOrder = new orders({product,buyersName,buyersAddress,quantity,price})
        await newOrder.save()
    } catch (error) {
        console.log(`order error ${error}`)
    }


})

router.get("/getOrders",async(req,res)=>{
    try {
        const allOrders = await orders.find()
        res.render('get-all-orders',{allOrders})
    } catch (error) {
        console.log(error)
    }
})

router.get('/getOneOrder/:id',async(req,res)=>{
    
    try {
        const one = await orders.findById(req.params.id).populate('products')
        res.render('get-single-order',{one})
    } catch (err) {
        console.log(err)
    }
})

router.get("/delivered/:id", async(req,res)=>{
    try {
        const one = await orders.findById(req.params.id)
        one.delivered = true;
        await one.save()
    } catch (error) {
        console.log(error)
    }
})

router.delete("/delete-order/:id",async(req,res)=>{
    try {
        const order = await orders.findByIdAndRemove(req.params.id)
        res.redirect('getOrders')
    } catch (error) {
        console.log(error)
    }
})


// router.post("delivered",(req,res)=>{
    
// })

router.delete("/deleteSingle/:id",async(req,res)=>{
    try {
        const one = await product.findById(req.params.id)
        
        const newpath = path.resolve(__dirname + '/..' +one.name)
        console.log(newpath)
        fs.unlinkSync(newpath)
        await one.remove()
        res.render('success',{message:'you succesfully deleted image',url:"/admin/admin"})
        
    } catch (error) {
        console.error(error)
    }
})

module.exports = router