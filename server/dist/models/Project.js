"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
    },
    client: {
        type: String,
        required: [true, "Client is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (val) {
                return val >= this.startDate;
            },
            message: "End date must be after start date",
        },
    },
    budget: {
        type: Number,
        min: [0, "Budget cannot be negative"],
    },
    status: {
        type: String,
        enum: ["planned", "active", "completed", "archived"],
        default: "planned"
    },
    thumbnail: String,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
const Project = mongoose_1.models.Project || (0, mongoose_1.model)("Project", projectSchema);
exports.default = Project;
