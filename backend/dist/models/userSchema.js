"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    globalRole: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    createdAt: {
        type: Date,
        date: Date.now
    }
});
exports.default = mongoose_1.default.model("user", userSchema);
//# sourceMappingURL=userSchema.js.map