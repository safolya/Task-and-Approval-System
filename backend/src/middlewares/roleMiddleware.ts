import express, { NextFunction, Request, Response } from "express"
const app=express();
import userSchema from "../models/userSchema";


export const roleMiddle=async(req:Request,res:Response,next:NextFunction)=>{
    //@ts-ignore
    const user=await userSchema.findById(req.user.userId);
    //@ts-ignore
         if(user?.globalRole != "ADMIN"){
            return res.json({
                message:"Admin access required"
            })
         }
         next();
}