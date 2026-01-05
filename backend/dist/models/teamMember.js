"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const teamMemberSchema = new mongoose_1.default.Schema({
    teamId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "team"
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user"
    },
    role: {
        enum: ["Manager", "Member"]
    }
});
//# sourceMappingURL=teamMember.js.map