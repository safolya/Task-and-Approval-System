import mongoose from "mongoose";
import approvalSchema from "../../models/approvalSchema";
import taskSchema from "../../models/taskSchema";
import { createNotification } from "../../service/notification.service";
import createAuditLog from "../../service/audit.service";

interface ApproveTaskInput {
  taskId: string;
  approvedBy: string;
}

export const approveTask = async ({
  taskId,
  approvedBy
}: ApproveTaskInput) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const approval = await approvalSchema.findOne({
        taskId,
        status: "PENDING"
      }).session(session);

      if (!approval) {
        throw new Error("APPROVAL_NOT_PENDING");
      }

      approval.status = "APPROVED";
      approval.reviewdBy = approvedBy as unknown as mongoose.Types.ObjectId;
      approval.comment = "Approved";
      await approval.save({ session });

      const task = await taskSchema.findById(taskId).session(session);
      if (!task) {
        throw new Error("TASK_NOT_FOUND");
      }

      task.status = "APPROVED";
      await task.save({ session });

      await createNotification({
        userId: task.assignto as unknown as string,
        type: "TASK_APPROVED",
        message: "Your assigned task has been approved",
        session
      });

      await createAuditLog({
        actor: approvedBy as unknown as mongoose.Types.ObjectId,
        action: "TASK_APPROVED",
        target: task._id,
        metadata: { taskId },
        session
      });
    });

  } finally {
    session.endSession();
  }
};


interface RejectTaskInput {
  taskId: string;
  approvedBy: string;
}

export const rejectTask = async ({
  taskId,
  approvedBy
}: RejectTaskInput) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const approval = await approvalSchema.findOne({
        taskId,
        status: "PENDING"
      }).session(session);

      if (!approval) {
        throw new Error("APPROVAL_NOT_PENDING");
      }

      approval.status = "REJECT";
      approval.reviewdBy = approvedBy as unknown as mongoose.Types.ObjectId;
      approval.comment = "Rejected";
      await approval.save({ session });

      const task = await taskSchema.findById(taskId).session(session);
      if (!task) {
        throw new Error("TASK_NOT_FOUND");
      }

      task.status = "REJECTED";
      await task.save({ session });

      await createNotification({
        userId: task.assignto as unknown as string,
        type: "TASK_REJECTED",
        message: "Your assigned task has been rejected",
        session
      });

      await createAuditLog({
        actor: approvedBy as unknown as mongoose.Types.ObjectId,
        action: "TASK_REJECTED",
        target: task._id,
        metadata: { taskId },
        session
      });
    });

  } finally {
    session.endSession();
  }
};