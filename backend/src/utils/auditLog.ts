import auditLog from "../models/auditLog";

const createAuditLog = async (actor:string,action:string,target:string,session = null ) => {
    await auditLog.create(
        [{
            actor,
            action,
            target,
            timestamp:Date.now()
        }],
        session ? { session } : {}
    );
};

export default createAuditLog;
