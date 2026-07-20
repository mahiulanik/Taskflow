import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },
        title: {type: String, required: true, trim: true},
        description: {type: String, required: true, trim: true},
        status: {
            type: String,
            required: true,
            trim: true,
            enum: ["In Progress", "Completed", "Cancelled"]
        }
    },
    {timestamps: true, versionKey: false}
)

const tasks = mongoose.model("tasks", taskSchema)

export default tasks