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
import crypto from "crypto";
import { managerMiddle } from "./middlewares/managerMiddleware";
import mongoose from "mongoose";
import createAuditLog from "./utils/auditLog";
const app = express();
app.use(express.json())
connectToDatabase()
dotenv.config()

app.use(cookieParser());

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT secret is not defined");
}
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userCount = await userSchema.countDocuments();
        if (userCount == 0) {
            bcrypt.hash(password, 10, async (err, hash) => {
                let user = await userSchema.create({
                    name: name,
                    email: email,
                    password: hash,
                    globalRole: "ADMIN"
                })
                const token = jwt.sign({
                    userId: user._id
                }, secret, { expiresIn: "10d" })
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                })
                res.json({
                    user,
                    token: token
                })
            })
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                const user = await userSchema.create({
                    name: name,
                    email: email,
                    password: hash,
                    globalRole: "USER"
                })
                const token = jwt.sign({
                    userId: user._id
                }, secret, { expiresIn: "10d" })
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                })
                res.json({
                    user,
                    token: token
                })
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userSchema.findOne({ email: email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    const token = jwt.sign({
                        userId: user._id
                    }, secret, { expiresIn: "10d" })
                    res.cookie("token", token)
                    res.json({
                        user,
                        token: token
                    })
                } else {
                    res.json({
                        message: "Incorrect Credentials"
                    })
                }
            })
        } else {
            console.log("user can't found")
        }
    } catch (error) {
        res.json({
            message: error
        })
    }
})

app.post("/create/team", authMiddle, roleMiddle, async (req, res) => {
    const { name } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const team = await teamSchema.create({
            name: name,
            //@ts-ignore
            createdBy: req.user.userId
        }, null, { session })
        await createAuditLog({
            //@ts-ignore
            actor: req.user.userId,
            action: "TEAM_CREATED",
            target: team._id,
            session
        })
        await session.commitTransaction();
        session.endSession();
        res.json({
            team
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.json({
            message: error
        })
    }

})
//when admin send invite a user through email
app.post("/team/invite/:teamId", authMiddle, roleMiddle, async (req, res) => {
    const { teamId } = req.params;
    const { email } = req.body;
    try {
        const invite = await teamInvite.create({
            teamId: teamId as unknown as string,
            email: email,
            role: "MEMBER",
            status: "PENDING",
            token: crypto.randomBytes(32).toString("hex")
        })
        res.json({
            message: "Invite send Successfully",
            invite
        })
    } catch (error) {
        res.json({
            message: error
        })
    }

})
// when user accept the invite
app.post("/invite/team/:token", authMiddle, async (req, res) => {
    const { token } = req.params
    const response = await teamInvite.findOne({
        token: token as unknown as string,
        status: "PENDING"
    })
    if (!response) {
        throw new Error("Invite not found");
    }
    const teamUser = await teamMember.create({
        teamId: response?.teamId as unknown as string,
        //@ts-ignore
        userId: req.user.userId,
        role: response?.role as string
    })
    response!.status = "ACCEPT";
    res.json({
        message: "User accepted",
        teamUser
    })
})

//admin changes the roles in the team
app.post("/team/:userId/role", authMiddle, roleMiddle, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body
    try {
        const roleChange = await teamMember.findOneAndUpdate({ userId: userId as string }, {
            role: role
        })
        res.json({
            message: "Role change Successfully",
            roleChange
        })
    } catch (error) {
        res.json({
            message: error
        })
    }

})

app.post("/team/:userId/remove", authMiddle, roleMiddle, async (req, res) => {
    const { userId } = req.params;
    try {
        const removeUser = await teamMember.findOneAndDelete({ userId: userId as string });
        res.json({
            message: "Remove Succesfully",
            removeUser
        })
    } catch (error) {
        res.json({
            message: error
        })
    }

})

app.post("/team/create/task/:teamId", authMiddle, managerMiddle, async (req, res) => {
    const { title, description, assignto, dueDate, } = req.body;
    const { teamId } = req.params;
    try {
        const userCheck = await teamMember.findOne({ userId: assignto });
        if (!userCheck) {
            return res.status(404).json({
                message: "User is not part of any team"
            });
        }
        if (userCheck.teamId?.toString() == teamId) {
            const task = await taskSchema.create({
                title: title,
                description: description,
                assignto: assignto,
                teamId: teamId as string,
                //@ts-ignore
                createdBy: req.user.userId,
                dueDate: new Date(dueDate)
            })
            await approvalSchema.create({
                taskId: task._id,
                //@ts-ignore
                requestedBy: req.user.userId,
                status: "PENDING"
            })
            res.json({
                message: "Task created Successfully",
                task
            })
        } else {
            res.json({
                message: "User is not a part of any team"
            })
        }
    } catch (error) {
        res.json({
            message: error
        })
    }


})

app.post("/team/approval/:taskId", authMiddle, managerMiddle, async (req, res) => {
    const { taskId } = req.params;
    const session = await mongoose.startSession();
    try {

        session.startTransaction();

        const approval = await approvalSchema.findOne({ taskId: taskId as string, status: "PENDING" }, null, { session });

        if (!approval) {
            return res.json({
                message: "Approval is not pending"
            })
        }

        approval.status = "APPROVED";
        //@ts-ignore
        approval.reviewdBy = req.user.userId;
        approval.comment = "Approved"
        await approval.save({ session });

        const task = await taskSchema.findById(taskId, null, { session });
        if (!task) {
            return new Error("Something Went Wrong")
        }
        task.status = "APPROVED"

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Task approved Succesfully"
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.json({
            message: error
        })
    }

})

app.post("/team/reject/:taskId", authMiddle, managerMiddle, async (req, res) => {
    const { taskId } = req.params;
    const session = await mongoose.startSession();
    try {

        session.startTransaction();

        const approval = await approvalSchema.findOne({ taskId: taskId as string, status: "PENDING" }, null, { session });

        if (!approval) {
            return res.json({
                message: "Approval is not pending"
            })
        }

        approval.status = "REJECT";
        //@ts-ignore
        approval.reviewdBy = req.user.userId;
        approval.comment = "Reject"
        await approval.save({ session });

        const task = await taskSchema.findById(taskId, null, { session });
        if (!task) {
            return new Error("Something Went Wrong")
        }
        task.status = "REJECTED"

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Task reject Succesfully"
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.json({
            message: error
        })
    }

})

app.listen(3000, () => {
    console.log("port is 3000")
})