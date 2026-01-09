import { Request, Response } from "express";
import * as teamService from "./team.service";
import mongoose, { mongo } from "mongoose";

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const team = await teamService.createTeam({
      name,
      //@ts-ignore
      userId: req.user!.userId
    });

    return res.status(201).json({
      success: true,
      team
    });

  } catch (error) {
    console.error("Create team error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create team"
    });
  }
};


export const invite = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body
    const invite = await teamService.invite({
      teamId: teamId as string,
      email
    });

    return res.status(201).json({
      success: true,
      message: "Invite send succesfully",
      invite
    })
  } catch (error) {
    console.error("Invite error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send invite"
    });
  }


}

//accept invite

export const resInvite=async(req:Request,res:Response)=>{
  try {
    const {token}=req.params;
    
    const teamUser=await teamService.acceptTeamInvite({
      token:token as string,
      //@ts-ignore
      userId:req.user.userId
    })

    res.status(201).json({
      success:true,
      message:"Invite Accepted",
      teamUser
    })

    
  } catch (error:any) {
    console.error("Accept invite error:", error);

    if (error.message === "INVITE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Invite not found or already used"
      });
    }

    if (error.message === "ALREADY_MEMBER") {
      return res.status(409).json({
        success: false,
        message: "User is already a team member"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to accept invite"
    });
  }
}