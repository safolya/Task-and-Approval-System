"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    teamId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "team"
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        enum: ["DARFT", "SUBMITTED", "APPROVED", "IN_PROGRESS", "COMPLETED", "REJECTED"]
    },
    dueDate: {
        type: Date,
        required: true
    }
});
module.exports = mongoose_1.default.model("task", taskSchema);
//# sourceMappingURL=taskSchema.js.map