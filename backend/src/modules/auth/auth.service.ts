import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../../models/userSchema";
import dotenv from "dotenv"
dotenv.config()

interface SignupInput {
    name: string;
    email: string;
    password: string;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_secret_not_defined");
}

export const signup = async ({ name, email, password }: SignupInput) => {

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const userCount = await userSchema.countDocuments();
    const globalRole = userCount === 0 ? "ADMIN" : "USER";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
        name,
        email,
        password: hashedPassword,
        globalRole
    });

    const token = jwt.sign(
        { userId: user._id },
        secret,
        { expiresIn: "10d" }
    );

    return {
        user,
        token
    };
};



interface LoginInput {
    email: string;
    password: string;
}


export const login = async ({email, password }: LoginInput) => {

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
        throw new Error("INCORRECT_CREDENTIALS");
    }

   const isPasswordValid=await bcrypt.compare(password, existingUser.password);

   if(!isPasswordValid){
        throw new Error("INCORRECT_CREDENTIALS");
   }

   const token = jwt.sign(
    { userId: existingUser._id },
    secret,
    { expiresIn: "10d" }
  );

  return{
    existingUser,
    token
  }
    

}



