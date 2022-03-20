//jshint esversion:6
const express =require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs")
const mongoose=require("mongoose")
var encrypt = require('mongoose-encryption');
const session = require('express-session')
const passport=require('passport');
const passportLocalMongoose=require("passport-local-mongoose");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))
  app.use(passport.initialize());
  app.use(passport.session());
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose);

// const secret = "Thisismysecretkeyokdone";
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });
const User=new mongoose.model("User",userSchema);
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/secrets",function(req,res){
    if(req.isAuthenticated())
    res.render("secrets");
    else
    res.redirect("/login");
})
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
app.post("/register",function(req,res){
 

    User.register({username:req.body.username},req.body.password, function(err, user) {
      if (err)
      console.log(err);
      else{
      passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets");
      });
      }
      
    });
});


app.post("/login",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    req.login(newUser, function(err) {
        if (err)
        console.log(err);
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
      });
})
app.listen(3000,function(res,req){
    console.log("okk fine");
})