const express=require('express');
const path=require('path');
const fs=require('fs');
const userModel=require('../models/user.model')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();
const cookieParser = require('cookie-parser');

const app=express();

app.use(cookieParser());



app.get('/login', isGuest , (req,res)=>{
    const error=req.query.error || "";
    res.render('login', {error})
})

app.post('/login',  async (req, res) => {
    let { email, password } = req.body;
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
        res.redirect('/user/login?error=User+Not+Found');
    }
    bcrypt.compare(password, findUser.password, function (err, result) {
        if (result) {
            const token=jwt.sign({email: email, id: findUser._id}, process.env.JWT_SECRETKEY);
            res.cookie('token', token);
            res.redirect('/');
            console.log('chale raha hai')
        } else {
            res.redirect('/user/login?error=Something+went+wrong');
        }
    });
});

app.get('/register', isGuest , (req,res)=>{
    res.render('register')
})

app.post('/register', (req, res)=>{
    let{name, email, password, age}=req.body; 
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        const newUser=await userModel.create({
        name:name,
        email:email,
        password:hash,
        age:age
    })
    console.log("user is createed",newUser);
     res.redirect('/user/login');
    });
   
});    
})

app.post('/logout', (req,res)=>{
    res.clearCookie('token');
    res.redirect('/login');
})

function isGuest(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRETKEY);
      return res.redirect('/'); // If token is valid, redirect to home
    } catch (err) {
      res.clearCookie('token'); // Invalid token — clear it
    }
  }

  next(); // No token or invalid token → allow access to login/register
}


module.exports=app;