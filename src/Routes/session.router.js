import { Router } from "express";
import {isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import { UserModel } from "../dao/models/users.model.js";

const router = Router()

router.get("/session/signup",(req,res)=>{
    res.render("signup",{title: "Registrarse", style: "signup.css", script: "signup.js"})
})

router.get("/",(req,res)=>{
    res.render("login",{title: "Login", style: "login.css", script: "login.js"})
})

router.post("/register",passport.authenticate("register",{
    failureRedirect: "/failRegister"}),async(req,res)=>{
        return res.json({status: "success", message: "Usuario registrado"})
})

router.get("/failRegister",(req,res)=>{
    res.send({error:"Error register"})
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body
    const user = await UserModel.findOne({email: email})
    if(!user){
        return res.json({status: "error", message: "User not found"})
    }else{
        if(!isValidPassword(password,user.password)){
            return res.json({status: "error", message: "Invalid password"})
        }else{
            const myToken = generateToken(user)
            res.cookie("coderCookieToken",myToken,{ 
               maxAge: 60 * 60 * 1000,
               httpOnly: true
            })
            return res.json({status: "success"}) 
        }
    }
})

router.get("/current",passportCall("jwt"),authorization("user"),(req,res)=>{
    res.send(req.user)
})

router.get("/failLogin",(req,res)=>{
    res.send({error: "Error login"})
})

router.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(!err){
           return res.json({
            message: "Sesión cerrada"
           })
        }else{
           return res.json({
            message: "Error al cerrar sesión"
           }) 
        }
    })
})

router.get("/github",passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

router.get("/githubcallback",passport.authenticate("github",{failureRedirect: "/"}),async(req,res)=>{
    res.redirect("/views")
})

export default router