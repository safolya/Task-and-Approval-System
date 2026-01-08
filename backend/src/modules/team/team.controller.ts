import { Request, Response } from "express";
import * as teamService from "./team.service";

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