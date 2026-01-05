import mongoose,{Schema} from "mongoose";

interface Iuser{
    name:string,
    email:string,
    password:string,
    globalRole:"ADMIN" | "USER",
    createdAt: Date
}

const userSchema=new Schema<Iuser>({
    name:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
         type:String,
         required:true
    },
    globalRole:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    },
    createdAt:{
        type:Date,
        date:Date.now()
    }
})

export default mongoose.model<Iuser>("user",userSchema);