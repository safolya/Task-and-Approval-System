import mongoose from "mongoose";

const auditSchema=new mongoose.Schema({
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    action:{
        type:String,
        required:true
    },
    target:{
        type:mongoose.Schema.Types.ObjectId
    }
},
    {
        timestamps:true
    }
)

export default mongoose.model("audit",auditSchema);