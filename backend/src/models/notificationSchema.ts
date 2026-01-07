import mongoose from "mongoose";

const notiSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    type:{
        type:String,
        enum:["TASK_ASSIGNED","APPROVAL_REQUEST","TASK_APPROVED","TASK_REJECTED"],
        required: true
    },
    message:{
        type:String,
        required: true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},

{
    timestamps:true
}

)

export default mongoose.model("notification",notiSchema);