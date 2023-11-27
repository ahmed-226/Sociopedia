import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js"

export const register =async (req, res) =>{
    try{   
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation
        }=req.body;

        const salt=await bcrybt.genSalt();
        const passwordHash=await bcrybt.hash(password, salt);

        const newUser =new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions: Math.floor(Math.random()*10000)
        })
        const savedUser=await newUser.save();
        res.status(201).json({status: 'success',data :{ user : savedUser}})
    }catch(err){
        res.status(500).json({status: 'error',error: {message :err.message}})
    }
}

export const login =async (req, res) => {
    try {
        const {email, password} =req.body;
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({status: 'fail',message :"user does not exist"})
        }

        const  isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({status: 'fail',message :'invalid credentials'})
        }

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
        delete user.password
        res.status(200).json({status :"succuess", data:{token :token,user:user}})

    }catch(err){
        res.status(500).json({status: 'error',error: {message :err.message}})
    }
}

export default register