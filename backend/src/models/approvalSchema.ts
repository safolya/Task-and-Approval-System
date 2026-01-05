import mongoose from "mongoose";

const approvalSchema=new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task",
        required:true
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    reviewdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    status:{
        type:String,
        enum:["PENDING","APPROVED","REJECT"]
    },
    comment:{
        type:String,
        required:false
    },
    requestedAt:{
        type:Date,
        date:Date.now()
    }

})

export default mongoose.model("approval",approvalSchema)