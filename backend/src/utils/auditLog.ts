import mongoose from "mongoose";
import auditLog from "../models/auditLog";

type CreateAuditLogParams = {
    actor: mongoose.Types.ObjectId;
    action: string;
    target: mongoose.Types.ObjectId;
    session: mongoose.ClientSession;
};

const createAuditLog = async ({
    actor,
    action,
    target,
    session
}: CreateAuditLogParams) => {
    await auditLog.create(
        [{
            actor,
            action,
            target,
        }],
        { session }
    );
};

export default createAuditLog;

