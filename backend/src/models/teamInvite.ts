import mongoose from "mongoose";

const inviteSchema=new mongoose.Schema({
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"team",
        required:true
    },
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    status:{
            type:String,
            enum:["PENDING","ACCEPT","REJECT"],
            default:"PENDING"
    },
    role:{
        type:String,
        default:"MEMBER"
    }
})

export default  mongoose.model("invite",inviteSchema)