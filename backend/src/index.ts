import express from "express"
import connectToDatabase from "./config/dbConnection";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes"
import teamRoute from "./modules/team/team.routes"
import taskRoute from "./modules/task/task.routes"
import approvalRoute from "./modules/approval/approval.routes"
import limiter from "./service/rate-limit.service";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(limiter)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
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