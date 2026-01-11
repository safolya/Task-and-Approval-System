import mongoose, { mongo } from "mongoose";
import createAuditLog from "../../service/audit.service";
import { createNotification } from "../../service/notification.service";
import approvalSchema from "../../models/approvalSchema";
import taskSchema from "../../models/taskSchema";
import teamMember from "../../models/teamMember";


interface GetTask {
  userId:string
}


export const getTask =async ({
  userId
}:GetTask)=>{
  const isTask=await taskSchema.find({assignto:userId});

  if(isTask.length===0){
    throw new Error ("TASK_NOT_FOUND")
  }

   const taskIds=isTask.map(m=>m._id)

   const tasks = await taskSchema.find({
    _id: { $in: taskIds }
  });
  
  return{
    tasks
  }

}


interface CreateTaskInput {
  teamId: string;
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  createdBy: string;
}

export const createTask = async ({
  teamId,
  title,
  description,
  assigneeId,
  dueDate,
  createdBy
}: CreateTaskInput) => {
  const session = await mongoose.startSession();

  try {
    let createdTask;

    await session.withTransaction(async () => {
      const member = await teamMember.findOne({
        teamId,
        userId: assigneeId
      }).session(session);

      if (!member) {
        throw new Error("ASSIGNEE_NOT_IN_TEAM");
      }

      const tasks = await taskSchema.create(
        [
          {
            title,
            description,
            assignto: assigneeId,
            teamId,
            createdBy,
            dueDate: new Date(dueDate),
          }
        ],
        { session }
      );
      

      createdTask = tasks[0];

      await approvalSchema.create(
        [
          {
            taskId: createdTask!._id,
            requestedBy: createdBy,
            status: "PENDING"
          }
        ],
        { session }
      );

      await createAuditLog ({
        actor: createdBy as unknown as mongoose.Types.ObjectId,
        action: "TASK_CREATED",
        target: createdTask?._id as unknown as mongoose.Types.ObjectId,
        metadata: { teamId },
        session
      });

      await createNotification({
        userId: assigneeId,
        type: "TASK_ASSIGNED",
        message: "You have been assigned a new task",
        session
      });
    });

    return {
      id: createdTask!._id.toString(),
      title: createdTask!.title,
      status: createdTask!.status,
      assigneeId: createdTask!.assignto,
      dueDate: createdTask!.dueDate
    };

  } finally {
    session.endSession();
  }
};