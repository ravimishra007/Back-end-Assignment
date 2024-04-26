const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.Schema');
const { blackListModel } = require('../models/blackList');
const userRouter = express.Router();

// get

userRouter.get('/users', async(req,res)=>{
    try {
        const users = await userModel.find()
        return res.status(200).json({error:false,items:users})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to getting the data.."})

    }
})


// register

userRouter.post('/register', async(req,res)=>{
    const {name,email,password} = req.body;
     const saltRound = 10;
    try {
        const user = await userModel.findOne({email})
        if (user) {
            console.log(("you are already registered,please log-in"))
            return res.status(401).send({msg:"you are already registered"})
        } else {
            bcrypt.hash(password,saltRound, async(err,hash)=>{
                if (err) {
                    console.error(err);
                    return res.status(404).json({error:true,msg:"unable to registered"})
                }
           const newUser = new userModel({name,email,password:hash})
           await newUser.save();
           return res.status(200).json({error:false,msg:"registered successfully"})
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to registered"})
    }

})


// login


userRouter.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(!user){
            console.log("user not found! please register first.")
            return res.status(404).json({error:true,msg:"user not found! please register first."})
        } 
       bcrypt.compare(password, user.password, async(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(404).json({error:true,msg:"password not match"})
        }
        if (result) {
            const accessToken = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
            return res.status(200).json({error:false,msg:"login successfully",accessToken})
        } else {
            return res.status(404).json({error:true,msg:"password not match. please put correct password."})
        }
       })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to login"})

    }
})


// update
userRouter.patch("/update/:id", async(req,res)=>{
    const{name,email}= req.body;
try {
    const user = await userModel.findById(req.params.id)
    if(!user){
        console.log("user not found")
        return res.status(404).json({error:true,msg:"user not found"})
    }

    const newUser = await userModel.findByIdAndUpdate({_id:req.params.id},req.body)
        return res.status(404).json({error:true,msg:"updated successfully", newUser})
    
} catch (error) {
    console.error(error);
    return res.status(500).json({error:true,msg:"unable to update"})

}
})

// delete

userRouter.delete("/delete/:id", async(req,res)=>{
    const{name,email}= req.body;
try {
    const user = await userModel.findById(req.params.id)
    if(!user){
        console.log("user not found")
        return res.status(404).json({error:true,msg:"user not found"})
    }

    const newUser = await userModel.findByIdAndDelete({_id:req.params.id},req.body)
        return res.status(404).json({error:true,msg:"deleted successfully", newUser})
    
} catch (error) {
    console.error(error);
    return res.status(500).json({error:true,msg:"unable to delete"})

}
})


// logout

userRouter.get('/logout', async(req,res)=>{

try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        console.log("No token found in the Authorization header");
        return res.status(401).json({ error: true, msg: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    if (!token) {
        console.log("No token found");
        return res.status(404).json({ error: true, msg: "No token found" });
    }
    const userToken = new blackListModel({ token });
    await userToken.save();
    return res.status(200).json({ error: false, msg: "Logged out successfully", userToken });
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, msg: "Unable to logout" });
}

})


module.exports = {userRouter}