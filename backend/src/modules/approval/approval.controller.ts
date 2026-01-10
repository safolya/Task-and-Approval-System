import { Request, Response } from "express";
import * as approvalService from "./approval.service";

export const approveTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    await approvalService.approveTask({
      taskId:taskId as string,
      //@ts-ignore
      approvedBy: req.user!.userId
    });

    return res.status(200).json({
      success: true,
      message: "Task approved successfully"
    });

  } catch (error: any) {
    console.error("Approve task error:", error);

    if (error.message === "APPROVAL_NOT_PENDING") {
      return res.status(400).json({
        success: false,
        message: "Approval is not pending"
      });
    }

    if (error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to approve task"
    });
  }
};


//reject task

export const rejectTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    await approvalService.rejectTask({
      taskId:taskId as string,
      //@ts-ignore
      approvedBy: req.user!.userId
    });

    return res.status(200).json({
      success: true,
      message: "Task rejected successfully"
    });

  } catch (error: any) {
    console.error("Approve task error:", error);

    if (error.message === "APPROVAL_NOT_PENDING") {
      return res.status(400).json({
        success: false,
        message: "Approval is not pending"
      });
    }

    if (error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to reject task"
    });
  }
};