import { Request, Response } from "express";
import * as teamService from "./team.service";
import { TeamRole } from "../../types/roles";

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


//role change


export const roleChange=async(req:Request,res:Response)=>{
  try {
    const {teamId,userId}=req.params;
    const {role}=req.body;
    //@ts-ignore
    const performedBy=req.user.userId

    if (role !== "MANAGER" && role !== "MEMBER") {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }
    
    const newRole:TeamRole=role

    await teamService.roleChange({
      teamId:teamId as string,
      userId:userId as string,
      newRole,
      performedBy
    }) 
     return res.status(200).json({
      success: true,
      message: "Role changed successfully"
    });

  } catch (error:any) {
    console.error("Change role error:", error);

    if (error.message === "MEMBER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this team"
      });
    }

    if (error.message === "SAME_ROLE") {
      return res.status(400).json({
        success: false,
        message: "User already has this role"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to change member role"
    });
  }
    
}

//remove team member 

export const remove=async(req:Request,res:Response)=>{
  try {
    const {userId,teamId}=req.params;

    await teamService.removeTeamMember({
      teamId:teamId as string,
      targetUserId: userId as string,
      //@ts-ignore
      performedBy: req.user!.userId
    });

    return res.status(200).json({
      success: true,
      message: "User removed from team successfully"
    });
    
  } catch (error:any) {
    console.error("Remove member error:", error);

    if (error.message === "MEMBER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this team"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to remove team member"
    });
  }

}