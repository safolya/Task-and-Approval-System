import express from "express"
import userSchema from "./models/userSchema"
import connectToDatabase from "./config/dbConnection";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import { authMiddle } from "./middlewares/authMiddleware";
import { roleMiddle } from "./middlewares/roleMiddleware";
import taskSchema from "./models/taskSchema";
import teamSchema from "./models/teamSchema"
import teamInvite from "./models/teamInvite";
import teamMember from "./models/teamMember";
import approvalSchema from "./models/approvalSchema";
import notificationSchema from "./models/notificationSchema";
import crypto from "crypto";
import { managerMiddle } from "./middlewares/managerMiddleware";
import mongoose from "mongoose";
import createAuditLog from "./utils/auditLog";
import authRoute from "./modules/auth/auth.routes"
import teamRoute from "./modules/team/team.routes"
import taskRoute from "./modules/task/task.routes"
import approvalRoute from "./modules/approval/approval.routes"
const app = express();
app.use(express.json())
connectToDatabase()
dotenv.config()

app.use(cookieParser());

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT secret is not defined");
}

//AUTH ROUTE 
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/team",teamRoute);
app.use("/api/v1/task",taskRoute);
app.use("/api/v1/approval",approvalRoute);



app.listen(3000, () => {
    console.log("port is 3000")
})