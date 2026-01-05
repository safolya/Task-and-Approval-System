import mongoose from "mongoose";

const teamMemberSchema=new mongoose.Schema({
      teamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"team"
      },
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
      },
      role:{
        type:String,
        enum:["MANAGER","MEMBER"],
        default:"MEMBER"
      }
})

export default mongoose.model("teamMember",teamMemberSchema)