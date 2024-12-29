import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser=async(req,res,next)=>{
    const {
        email,
        password
    }=req.body
    if(!email || !password)
        return res.status(400).json({message:"All fields are required"})
    try{
    const user= await prisma.user.findUnique({
            where: {
                email
            }
    })
    if(!user)
        return res.status(400).json({message:"Unable to find User"})
   
    const validatePassword=bcrypt.compare(password,user.password);
    if(!validatePassword)
        return res.status(400).json({message:"Invalid user credentials"})

    const accessToken=jwt.sign({userId:user.id,email:user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    const refreshToken=jwt.sign({userId:user.id,email:user.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

    const createdAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(createdAt.getDate() + 10); 

    const refreshTokenDb=await prisma.refreshToken.create({
        data:{
            token:refreshToken,
            userId:user.id,
            createdAt:createdAt,
            expiresAt:expiresAt
        }
    })
    const options = {
        httpOnly: true,
        secure: true,
      };
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while logging in", error: error.message });
    }
}

const logoutUser=async(req,res,next)=>{
    try{
        
        const token=req.cookies?.accessToken
        if (!token) {
            res.status(400).json({message:"Token is missing"});            
        }

        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken)
            res.status(400).json({message:"Invalid token"})

        await prisma.blackListToken.create({
            data:{
                token
            }
        })

        return res.status(201).json({message:"User logged out successfully"})
    }
    catch(error){
        return res.status(500),json({message:"Error occured while logging out user",error:error.message})
    }
}

const refreshAccessToken=async(req,res,next)=>{
    const {refresh_Token}=req.body
    if(!refresh_Token){
        res.status(400).json({message:"Refresh token required"})
    }

    try {
        const dbToken=await prisma.refreshToken.findUnique(
            {
                where:{
                    token:refresh_Token
                },
                include:{
                    user:true
                }
            })
            
            if(!dbToken){
                return res.status(400).json({message:"Refresh Token not found"})
            }

            const presentTime=new Date()
            if(presentTime>refresh_Token.expiresAt){
                await prisma.refreshToken.delete(
                    {
                        where:{
                            token:refresh_Token
                        }
                    })
                    return res.status(401).json({message:"Refresh Token Deleted"})
            }

            const refreshedAccessToken=jwt.sign({userId:dbToken.user.id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
            if(!refreshedAccessToken){
                return res.status(400).json({message:"Refreshed Token not found"})
            }
            return res.status(201).json({message:"Access Token refreshed",accessToken:refreshedAccessToken})
               } catch (error) {
        return res.status(500).json({message:"Error while refreshing Access Token",error:error.message})
    }
}


export {loginUser,logoutUser,refreshAccessToken}