const express = require("express");
const orders = require('../schema/orders')
const users = require("../schema/user")
const router = express.Router();

//authentication middleware
const isAuth = (req,res,next)=>{
    if (req.session.user){
        return next()
    }
    else {
        res.redirect('/login')
    }
   }

//routes

router.post("/cart-add",async(req,res)=>{
    try { 
        const {id,quantity} = req.body
        const user = await users.findById(req.session.user._id)
        if(user.cart.indexOf(id) < 0){
            user.cart.push(id)
            user.quantity.push(quantity)
            await user.save()
            res.redirect('/orders/view-cart')
        }        

    } catch (error) {
        console.log(error)
    }
})

router.get("/cart-remove/:id",async(req,res)=>{
    try {
        const user = await users.findById(req.session.user._id)
        const removee = req.params.id
        const removeIndex = user.cart.indexOf(removee)
        if(removeIndex >= 0)
        {
            user.cart.splice(removeIndex,1)
            user.quantity.splice(removeIndex,1)

            await user.save()
            res.redirect('/orders/view-cart')
        }
        
    } catch (error) {
        console.log(error)
    }
})

//order is stored in the data base in /success
router.get("/success",async(req,res)=>{
    try {
        const user = await users.findById(req.session.user._id)
        //create order

        console.log(user)
        const products = user.cart
        const quantity = user.quantity
        const buyersName = user.Fullname
        const buyersAddress = user.Address
        const buyerPhoneNo = user.Phoneno
        const delivered = false
        const price = req.session.price
        
        const newOrder = new orders({products,quantity,buyersName,buyersAddress,buyerPhoneNo,delivered,price})
        const success = await newOrder.save()
        console.log(success._id)
        if(success){
            user.cart = []
            user.order.push(success._id)
            await user.save()
            res.render('success',{message:'your order was successful',url:'/'})
            //url to be updated to the marketplace
            req.session.order = null
            req.session.price = null
        }        
    } catch (error) {
        console.log(error)
    }
})
router.get("/failure",async(req,res)=>{
    try {
        req.session.order = null
        req.session.price = null
        res.render('failure',{message:`sorry ${req.session.user} your payment failed`,url:'/orders/view-cart'})
    } catch (error) {
        console.log(error)
    }
})
router.post("/create-order",async(req,res)=>{
     //json post
    // one of cart submits 2 event listeners the other one:flutterwave
    try {
        const {price} = req.body
        req.session.price = price
        console.log(price)
        res.send({message:"created"})
    } catch (error) {
        console.log(error)
    }
})
router.get("/view-orders",async(req,res)=>{
    try {

    const user= await users.findById(req.session.user._id).populate({path:'order',populate:{path:'products',model:'products'}})
    const order = user.order

    res.render('view-orders',{orders:order})  

    console.log(order)


    } catch (error) {
        console.log(error)
    }
})



router.get("/view-cart",async(req,res)=>{
    try {
        const user = await users.findById(req.session.user._id).populate('cart')
        const cart = user.cart
        const quantity = user.quantity
        res.render('view-cart',{cart,quantity,user})

    } catch (error) {
        console.log(error)
    }
})

router.get("/",async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
})
module.exports = router