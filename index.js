const express = require("express");
const app = express();
const port = 3000||process.ENV.port;

const mongoose = require("mongoose")
const bcrypt = require('bcrypt')


// express formidable
const formidable = require("express-formidable")
//app.use(formidable())

const bodyParser = require("body-parser")
app.use(bodyParser())
app.use(bodyParser.json())
//ejs setup
const ejs = require("ejs")
app.set('view engine','ejs')

app.use(express.static('public'))

//mongo setup
const mongoUri = 'mongodb://localhost:27017/dee-fashion'

mongoose.connect(mongoUri)
.then(()=>{console.log("database started succesfully")})
.catch(err=>{console.log(err)})

// session setup
const session = require("express-session")
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))

//method override
const methodOveride = require("method-override")
app.use(methodOveride('_method'))
// Schemas
const users = require("./schema/user") 
const Admin = require('./schema/admin')

// custom middlewares
const isAuth = (req,res,next)=>{
    if (req.session.user){
        return next()
    }
    else {
        res.redirect('/login')
    }
   }


app.get('/',isAuth,(req,res)=>{
    res.render('home')
    console.log(req.session.user)
})


  app.get("/register",async(req,res)=>{
    try {
        res.render('register',{url1:"/register", url2:"/login"})
    } catch (error) {
        console.log(error)
    }
})

app.get("/register-admin123",async(req,res)=>{
    try {
        res.render('register',{url1:"/register-admin123", url2:"/login-admin123"})
    } catch (error) {
        console.log(error)
    }
})


app.post("/register",async(req,res)=>{
    try {
        const {Firstname,Surname,Email,Address,Phoneno,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;
            const newUser = new users({Firstname,Surname,Fullname,Email,Address,Phoneno,Username,Password})
            await newUser.save()

            res.render('login',{message:`you have successfully signed up,please login`})
            console.log(newUser)

        }
       
    } catch (error) {
        console.log(error)
    }
})

app.post("/register-admin123",async(req,res)=>{
    try {
        const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;
            const newUser = new Admin({Fullname,Email,Username,Password})
            await newUser.save()

            res.render('login',{message:`you have successfully signed up,please login`})
            console.log(newUser)

        }
       
    } catch (error) {
        console.log(error)
    }
})

//edit user 
app.get("/editUser",isAuth, async(req,res)=>{
    try {
        const user = req.session.user
        res.render('edit-user',{user})
        
    } catch (error) {
        console.log(error)
    }
})
app.put("/editUser/:id",isAuth,async(req,res)=>{
    try {
        let user =await users.findById(req.params.id)
        const {Firstname,Surname,Email,Address,Phoneno,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;

            user.Firstname = Firstname;
            user.Surname = Surname;
            user.Email = Email;
            user.Fullname = Fullname;
            user.Address = Address;
            user.Phoneno = Phoneno;
            user.Username = Username;
            user.Password = Password;
            await user.save()

            console.log(user)
            res.render('success',{message:`You have successfully updated your profile`,url:'/'})

        }
       
    } catch (error) {
        console.log(error)
    }
})

//edit admin
app.get("/edit-admin123",isAuth, async(req,res)=>{
    try {
        const user = req.session.user
        res.render('edit-admin',{user})
        
    } catch (error) {
        console.log(error)
    }
})
app.put("/eddit-admin123/:id",isAuth,async(req,res)=>{
    try {
        let user =await Admin.findById(req.params.id)
        const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;

            
            user.Email = Email;
            user.Fullname = Fullname;
            user.Username = Username;
            user.Password = Password;
            await user.save()

            console.log(user)
            res.render('success',{message:`You have successfully updated your profile`,url:'/'})

        }
       
    } catch (error) {
        console.log(error)
    }
})


app.post("/login",async(req,res)=>{
    try {
        const {Username,Password} = req.body
        const user = await users.findOne({Username})
    
        if(!user)
        {
            res.redirect('/login')
        }
        const passwordHash = bcrypt.compareSync(Password, user.Password)
        if(!passwordHash)
        {
            res.redirect('/login')
        }
        else{
            req.session.user = user;
            req.session.save(function (err) {
                if (err) return next(err)
                res.redirect('/')
              })
        }

    } catch (error) {
        console.log(error)
    }
})

app.get("/login",async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error)
    }
})

app.get("/logout",async(req,res)=>{
    try {
        req.session.user = null;
        req.session.save((err)=>{if(err) next(err)
        })

        req.session.regenerate((err)=>{
            if(err) next(err)
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }
})
//controller routes
const adminController = require("./controller/admin")
const orderController = require("./controller/order")
const userController = require("./controller/user")





app.use('/admin', adminController)
app.use('/orders',orderController )
app.use('/users',userController)



app.listen(port,()=>{console.log(`server started on port ${port}`)})