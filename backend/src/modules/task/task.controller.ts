import { Request, Response } from "express";
import * as taskService from "./task.service";


export const allTask=async(req:Request,res:Response)=>{
    try {
        //@ts-ignore
        const userId=req.user.userId;
    
        const allTask= await taskService.getTask({
          userId
        })
        return res.status(201).json({
          success: true,
          allTask
        })
    
      } catch (error:any) {
        console.error("Task error:", error);
    
        if (error.message === "TASK_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            message: "Task not Found"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Something went wrong"
        });
      }
}


export const createTask=async(req:Request,res:Response)=>{
    try {
        const { teamId } = req.params;
    const { title, description, assignto, dueDate } = req.body;

    const task = await taskService.createTask({
      teamId:teamId as string,
      title,
      description,
      assigneeId: assignto,
      dueDate,
      //@ts-ignore
      createdBy: req.user!.userId
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
    } catch (error:any) {
        console.error("Create task error:", error);

    if (error.message === "ASSIGNEE_NOT_IN_TEAM") {
      return res.status(400).json({
        success: false,
        message: "Assigned user is not a member of this team"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
    }
}