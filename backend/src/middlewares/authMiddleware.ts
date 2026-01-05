import cookieParser from "cookie-parser";
import  express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const app=express();

app.use(cookieParser());

const secret=process.env.JWT_SECRET;
if(!secret){
     throw new Error("JWT secret is not defined");
}

export const authMiddle=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.token;
    if(!token){
        return res.json({
            message:"Login first"
        })
    }
    try {
        const decoded=jwt.verify(token,secret);
    if(decoded){
        //@ts-ignore
        req.user={
            //@ts-ignore
          userId:decoded.userId,
          //@ts-ignore
          globalRole:decoded.globalRole
        };
        next();
        //@ts-ignore
        // console.log(await userSchema.findById(req.user.userId))
        
    }else{
        res.json({
            message:"Login first"
        })
    }
    } catch (error:any) {
        res.json({
            message:error.message
        })
    }
    
}