import mongoose from "mongoose";
interface Iuser {
    name: string;
    email: string;
    password: string;
    globalRole: "ADMIN" | "USER";
    createdAt: Date;
}
declare const _default: mongoose.Model<Iuser, {}, {}, {}, mongoose.Document<unknown, {}, Iuser, {}, mongoose.DefaultSchemaOptions> & Iuser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, Iuser>;
export default _default;
//# sourceMappingURL=userSchema.d.ts.map