import mongoose from "mongoose";

const auditSchema=new mongoose.Schema({
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    action:{
        type:String
    },
    target:{
        type:String
    },
    timestamp:{
        type:Date
    }
})

export default mongoose.model("audit",auditSchema);