"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: "Please enter a valid email",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be 6 length"],
        validate: {
            validator: (value) => validator_1.default.isStrongPassword(value, {
                minLength: 6,
                // minNumbers: 1,
                // minUppercase: 1,
                // minSymbols: 1,
            }),
            message: "Password {VALUE} is not enough strong!",
        },
        set: (v) => bcryptjs_1.default.hashSync(v, bcryptjs_1.default.genSaltSync(12)),
    },
    role: {
        type: String,
        enum: ["admin", "manager", "member"],
        default: "member",
    },
    avatar: { type: String, },
    department: { type: String },
    skills: {
        type: [String],
        validate: {
            validator: (arr) => arr.length <= 20,
            message: "You can add up to 20 skills",
        },
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
