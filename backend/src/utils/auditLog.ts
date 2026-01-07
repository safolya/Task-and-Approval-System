import mongoose from "mongoose";
import auditLog from "../models/auditLog";

type CreateAuditLogParams = {
    actor: mongoose.Types.ObjectId;
    action: string;
    target: mongoose.Types.ObjectId;
    metadata?:Record<string, unknown>;
    session: mongoose.ClientSession;
};

const createAuditLog = async ({
    actor,
    action,
    target,
    metadata={},
    session
}: CreateAuditLogParams) => {
    await auditLog.create(
        [{
            actor,
            action,
            target,
            metadata
        }],
        session ? { session } : undefined
    );
};

export default createAuditLog;

