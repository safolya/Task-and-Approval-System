import express, { NextFunction, Request, Response } from "express";
import teamMember from "../models/teamMember";
import taskSchema from "../models/taskSchema";

export const managerMiddle=async(req:Request,res:Response,next:NextFunction)=>{
    let teamId=req.params.teamId;
    if(!teamId){
      const{taskId}=req.params;
      const task=await taskSchema.findById(taskId);
        teamId=task?.teamId.toString()
      }
    try {
    //@ts-ignore
        const teamManager=await teamMember.findOne({userId:req.user.userId})
      if(!teamManager){
          throw new Error("Something went Worng")
      }
      if(teamManager.role=="MANAGER" && teamManager.teamId?.toString()===teamId){
        next()
      }
      else{
        return res.json({
            message:"Manager access required"
        })
      }
    } catch (error) {
        res.json(error)
    }
      
}
