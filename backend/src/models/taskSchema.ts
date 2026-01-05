import mongoose from "mongoose";

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"team",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    assignto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    status:{
        type:String,
        enum:["SUBMITTED","APPROVED","IN_PROGRESS","COMPLETED","REJECTED"],
        default:"SUBMITTED"
    },
    dueDate:{
        type:Date,
        required:true
    }
})

export default mongoose.model("task",taskSchema);