"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Sprint",
        required: true,
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assigns: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }]
}, { timestamps: true });
const Task = mongoose_1.models.Task || (0, mongoose_1.model)("Task", taskSchema);
exports.default = Task;
