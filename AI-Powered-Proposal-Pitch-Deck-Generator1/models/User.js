import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
{
email: { type: String, unique: true, required: true },
password: { type: String, required: true },
plan: { type: String, enum: ["free", "premium"], default: "free" },
},
{ timestamps: true }
);


export default mongoose.models.User || mongoose.model("User", UserSchema);