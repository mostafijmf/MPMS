import { model, models, Schema } from "mongoose";
import { ITask } from "../types";

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [5000, "Description cannot exceed 5000 characters"],
    trim: true,
  },
  estimateHours: {
    type: Number,
    min: 0,
    max: 1000,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["todo", "in_progress", "review", "done"],
    default: "todo",
  },
  dueDate: {
    type: Date,
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  sprintId: {
    type: Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assigns: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

const Task = models.Task || model("Task", taskSchema);

export default Task;