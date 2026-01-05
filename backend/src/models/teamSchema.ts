import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user"
    },
    createdAt:{
        type:Date,
        date:Date.now()
    }
})

export default mongoose.model("team",teamSchema)