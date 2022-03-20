//jshint esversion:6
const express =require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs")
const mongoose=require("mongoose")
var encrypt = require('mongoose-encryption');
const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;
const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
// const secret = "Thisismysecretkeyokdone";
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });
const User=new mongoose.model("User",userSchema);




app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            email:req.body.username,
            password:hash
        });
       
        newUser.save(function(err){
            if(err)
            console.log(err);
            else
             res.render("secrets");
        })
    });
   

})
app.post("/login",function(req,res){
    const user=req.body.username;
    const password=req.body.password;

    User.findOne({email:user},function(err,userdata){
        if(err)
        console.log(err);
        else{
            if(userdata)
            {
                // if(userdata.password===password)
                // res.render("secrets");
                bcrypt.compare(password,userdata.password, function(err, result) {
                    if(result == true)
                    res.render("secrets");
                });
            }
        }
    })
})
app.listen(3000,function(res,req){
    console.log("okk fine");
})