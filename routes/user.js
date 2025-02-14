const express = require("express");
const router = express.Router();
const User = require("../models/user")
const {createHmac } = require('crypto');
const { createTokenForUser } = require("../services/auth");

router.get("/signup",(req,res) => {
  res.render("signup");
})

router.get("/signin",(req,res) => {
  res.render("signin");
})

router.post("/signin",async (req,res) => {
  const {email,password} = req.body;
  const user =await User.findOne({email :email});
  console.log(user)
  if(!user) return res.render("signin",{
    error : "Incorrect Email or Password"
  });
  const salt = user.salt;
  const hashedPassword = createHmac("sha256",salt)
  .update(password)
  .digest("hex");
  if(hashedPassword !== user.password)
    return res.render("signin",{
  error:"Incorrect Email or Password"
  });

  const token = createTokenForUser(user);

  return res.cookie("token",token).redirect("/")
})

router.post("/signup",async (req,res) => {
  const {fullName, email, password} = req.body;
  const user = await User.create({
    fullName,
    email,
    password
  })
  return res.render("signin");
})

router.get("/logout", (req,res) => {
  res.clearCookie("token").redirect("/")
})

module.exports = router;