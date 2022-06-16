const express = require("express");
const router = express.Router();
const users = require('../schema/user')
const items = require('../schema/product')
const bcrypt = require('bcrypt')




router.get("/get-Items",async(req,res)=>{
    try {
        const allItems = await items.find()
        res.render('market-items',{allItems})
    } catch (error) {
        console.log(error)
    }
})

router.get("/getSingleItem/:id",async(req,res)=>{
    try {
        const one = await items.findById(req.params.id)
        res.render('single-item',{one})
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

router.get("/",async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;