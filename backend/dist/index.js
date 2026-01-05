"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSchema_1 = __importDefault(require("./models/userSchema"));
const app = (0, express_1.default)();
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userCount = await userSchema_1.default.countDocuments();
        if (userCount == 0) {
            const user = await userSchema_1.default.create({
                name: name,
                email: email,
                pasword: password,
                gobalRole: "ADMIN"
            });
            res.json({
                user
            });
        }
        else {
            const user = await userSchema_1.default.create({
                name: name,
                email: email,
                pasword: password,
                globalRole: "USER"
            });
            res.json({
                user
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(3000, () => {
    console.log("port is 3000");
});
//# sourceMappingURL=index.js.map